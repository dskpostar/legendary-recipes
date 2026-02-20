import type { User } from './types';
import type { AuthProvider } from './auth';

interface StoredUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
  password_hash: string;
}

const USERS_KEY = 'lr_users';
const SESSION_KEY = 'lr_session';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

function generateId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11);
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser(stored: StoredUser): User {
  return {
    id: stored.id,
    email: stored.email,
    display_name: stored.display_name,
    avatar_url: stored.avatar_url,
    created_at: stored.created_at,
  };
}

export function createLocalAuthProvider(): AuthProvider {
  const listeners = new Set<(user: User | null) => void>();

  function notify(user: User | null) {
    listeners.forEach((cb) => cb(user));
  }

  return {
    async signUp(email, password, displayName) {
      const users = getStoredUsers();
      if (users.some((u) => u.email === email)) {
        throw new Error('This email is already registered');
      }

      const nameEncoded = encodeURIComponent(displayName);
      const newUser: StoredUser = {
        id: generateId(),
        email,
        display_name: displayName,
        avatar_url: `https://ui-avatars.com/api/?name=${nameEncoded}&background=111111&color=fafafa&bold=true`,
        created_at: new Date().toISOString(),
        password_hash: simpleHash(password),
      };

      users.push(newUser);
      saveStoredUsers(users);

      const publicUser = toPublicUser(newUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      notify(publicUser);
      return publicUser;
    },

    async signIn(email, password) {
      const users = getStoredUsers();
      const found = users.find((u) => u.email === email && u.password_hash === simpleHash(password));
      if (!found) {
        throw new Error('Invalid email or password');
      }

      const publicUser = toPublicUser(found);
      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      notify(publicUser);
      return publicUser;
    },

    async signOut() {
      localStorage.removeItem(SESSION_KEY);
      notify(null);
    },

    getCurrentUser() {
      try {
        const data = localStorage.getItem(SESSION_KEY);
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    },

    onAuthStateChange(callback) {
      listeners.add(callback);
      return () => { listeners.delete(callback); };
    },
  };
}
