import type { User } from './types';

export interface AuthProvider {
  signUp(email: string, password: string, displayName: string): Promise<User | null>;
  signIn(email: string, password: string): Promise<User | null>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}
