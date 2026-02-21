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
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface ProfileData {
  profile: User | null;
  isAdmin: boolean;
}

async function fetchProfile(userId: string): Promise<ProfileData> {
  if (!supabase) return { profile: null, isAdmin: false };
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (!data) return { profile: null, isAdmin: false };
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

    // Restore session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { profile, isAdmin: admin } = await fetchProfile(session.user.id);
        setUser(profile);
        setIsAdmin(admin);
      }
      setIsAuthReady(true);
    }).catch(() => {
      setIsAuthReady(true);
    });

    // Only handle sign-out via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured');
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (data.user) {
        const { profile, isAdmin: admin } = await fetchProfile(data.user.id);
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

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthReady, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProviderComponent');
  return ctx;
}
