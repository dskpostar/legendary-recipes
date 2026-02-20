import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from './types';
import type { AuthProvider } from './auth';
import { createLocalAuthProvider } from './auth-local';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const authProvider: AuthProvider = createLocalAuthProvider();

export function AuthProviderComponent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authProvider.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return authProvider.onAuthStateChange(setUser);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authProvider.signIn(email, password);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      await authProvider.signUp(email, password, displayName);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await authProvider.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProviderComponent');
  return ctx;
}
