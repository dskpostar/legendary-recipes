import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Clear stale Supabase auth state BEFORE creating the client
try {
  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith('sb-')) continue;
    // Remove PKCE code verifiers (can block new auth flows)
    if (key.includes('-code-verifier') || key.includes('-auth-token-code-verifier')) {
      localStorage.removeItem(key);
      continue;
    }
    // Remove expired session tokens
    if (key.endsWith('-auth-token')) {
      const raw = localStorage.getItem(key);
      const stored = raw ? JSON.parse(raw) : null;
      if (!stored?.expires_at || stored.expires_at * 1000 < Date.now()) {
        localStorage.removeItem(key);
      }
    }
  }
} catch { /* ignore */ }

// Custom fetch with 10-second timeout to prevent hanging requests
const fetchWithTimeout: typeof fetch = (input, init) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(id));
};

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: true,
        detectSessionInUrl: true,
      },
      global: { fetch: fetchWithTimeout },
    })
  : null;
