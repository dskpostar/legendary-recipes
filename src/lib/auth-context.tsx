import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from './types';
import { supabase, isSupabaseConfigured } from './supabase';

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  isAuthReady: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface ProfileData {
  profile: User | null;
  isAdmin: boolean;
}

async function fetchOrCreateProfile(supabaseUser: { id: string; email?: string; user_metadata: Record<string, unknown> }): Promise<ProfileData> {
  if (!supabase) return { profile: null, isAdmin: false };
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  if (data) {
    return {
      profile: {
        id: data.id,
        email: data.email,
        display_name: data.display_name,
        avatar_url: data.avatar_url ?? '',
        created_at: data.created_at,
      },
      isAdmin: data.is_admin === true,
    };
  }

  // First-time OAuth user: create profile from provider metadata
  const email = supabaseUser.email ?? '';
  const meta = supabaseUser.user_metadata;
  const displayName = String(meta.full_name ?? meta.name ?? email.split('@')[0]);
  const avatarUrl = String(meta.avatar_url ?? meta.picture ?? '');

  const { data: newProfile } = await supabase
    .from('profiles')
    .insert({ id: supabaseUser.id, email, display_name: displayName, avatar_url: avatarUrl })
    .select()
    .single();

  if (!newProfile) return { profile: null, isAdmin: false };

  return {
    profile: {
      id: newProfile.id,
      email: newProfile.email,
      display_name: newProfile.display_name,
      avatar_url: newProfile.avatar_url ?? '',
      created_at: newProfile.created_at,
    },
    isAdmin: false,
  };
}

export function AuthProviderComponent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthReady(true);
      return;
    }

    // onAuthStateChange handles all auth events including OAuth callbacks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { profile, isAdmin: admin } = await fetchOrCreateProfile(session.user);
        setUser(profile);
        setIsAdmin(admin);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured');
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      // Explicitly fetch profile for fast UI update (onAuthStateChange also fires)
      if (data.user) {
        const { profile, isAdmin: admin } = await fetchOrCreateProfile(data.user);
        setUser(profile);
        setIsAdmin(admin);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    if (!supabase) throw new Error('Supabase is not configured');
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('Sign up failed');

      const nameEncoded = encodeURIComponent(displayName);
      const avatarUrl = `https://ui-avatars.com/api/?name=${nameEncoded}&background=111111&color=fafafa&bold=true`;
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        display_name: displayName,
        avatar_url: avatarUrl,
      });
      if (profileError) throw new Error(profileError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw new Error(error.message);
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthReady, isLoading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProviderComponent');
  return ctx;
}
