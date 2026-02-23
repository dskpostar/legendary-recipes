import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
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
  // Prevents onAuthStateChange from overwriting state while signIn is in flight
  const signingInRef = useRef(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthReady(true);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // IMPORTANT: keep this callback synchronous.
      // The Supabase SDK holds an internal navigator.locks lock while calling this callback.
      // Any async Supabase call inside here (like fetchProfile) would try to acquire the
      // same lock → deadlock. Defer async work via setTimeout so it runs after lock release.

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setIsAuthReady(true);
        return;
      }

      if (session?.user && !signingInRef.current) {
        const userId = session.user.id;
        // Defer to next tick so SDK lock is released before we call fetchProfile
        setTimeout(async () => {
          const result = await fetchProfile(userId);
          if (result) {
            setUser(result.user);
            setIsAdmin(result.isAdmin);
          }
          setIsAuthReady(true);
        }, 0);
      } else if (!signingInRef.current) {
        setIsAuthReady(true);
      }
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
    signingInRef.current = true;
    setIsAuthReady(false);
    setIsLoading(true);
    try {
      // Drain any pending lock (e.g. signOut still in flight) before attempting sign-in
      await supabase.auth.getSession();
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
      signingInRef.current = false;
      // Always unblock UI when signIn completes (success or failure)
      setIsAuthReady(true);
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
    // Let the SDK clean up properly — scope: 'local' clears storage without a network request
    try {
      if (supabase) await supabase.auth.signOut({ scope: 'local' });
    } catch { /* ignore */ }
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
