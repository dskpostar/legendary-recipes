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

async function fetchProfile(userId: string): Promise<{ user: User; isAdmin: boolean } | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    user: {
      id: data.id,
      email: data.email,
      display_name: data.display_name,
      avatar_url: data.avatar_url ?? '',
      created_at: data.created_at,
      membership_plan: (data.membership_plan ?? 'free') as 'free' | 'pro' | 'elite',
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setIsAuthReady(true);
        return;
      }

      if (session?.user) {
        const result = await fetchProfile(session.user.id);
        if (result) {
          setUser(result.user);
          setIsAdmin(result.isAdmin);
        }
        // If profile fetch fails, don't clear existing user — let them stay logged in
      }

      setIsAuthReady(true);
    });

    // 10s safety timeout: if onAuthStateChange never fires, unblock the UI
    const timer = setTimeout(() => {
      setIsAuthReady(true);
    }, 10000);

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured');
    setIsLoading(true);
    // Clear stale sb-* keys so navigator.locks never gets stuck
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('sb-')) localStorage.removeItem(key);
      }
    } catch { /* ignore */ }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (data.user) {
        const result = await fetchProfile(data.user.id);
        if (result) {
          setUser(result.user);
          setIsAdmin(result.isAdmin);
        }
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
    // Immediately clear React state so UI updates right away
    setUser(null);
    setIsAdmin(false);
    // Clear all sb-* localStorage keys to prevent stale lock state on next sign-in
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('sb-')) localStorage.removeItem(key);
      }
    } catch { /* ignore */ }
    // Notify server (best-effort, fire and forget)
    supabase?.auth.signOut({ scope: 'local' }).catch(() => {});
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
