import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../lib/auth-context';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, signUp, signInWithGoogle, isLoading } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    try {
      if (mode === 'signUp') {
        if (!displayName.trim() || !email.trim() || !password.trim()) {
          setError('Please fill in all fields');
          return;
        }
        if (password.length < 4) {
          setError('Password must be at least 4 characters');
          return;
        }
        await signUp(email, password, displayName);
      } else {
        if (!email.trim() || !password.trim()) {
          setError('Please fill in all fields');
          return;
        }
        await signIn(email, password);
      }
      onClose();
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (err) {
      console.error('Auth error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Redirects to Google — modal stays open briefly during redirect
    } catch (err) {
      setIsGoogleLoading(false);
      if (err instanceof Error) setError(err.message);
      else setError('Failed to sign in with Google');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-navy border border-black/10 rounded-none p-8 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-2xl font-bold text-cream">
            {mode === 'signIn' ? 'Welcome back' : 'Create account'}
          </h2>
          <button
            onClick={onClose}
            className="text-cream/40 hover:text-cream transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-cream/50 text-sm mb-6">
          {mode === 'signIn'
            ? 'Sign in to like recipes and leave comments'
            : 'Join to save your favorite recipes'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-black/20 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 cursor-pointer mb-4"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isGoogleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-xs text-cream/30">or</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <div className="space-y-4">
          {mode === 'signUp' && (
            <div>
              <label className="block text-sm text-cream/60 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2.5 rounded-none bg-white border border-black/15 text-cream placeholder-cream/30 focus:outline-none focus:border-black/40 transition-colors"
                placeholder="Your name"
                autoFocus
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-cream/60 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2.5 rounded-none bg-white border border-black/15 text-cream placeholder-cream/30 focus:outline-none focus:border-black/40 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-cream/60 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2.5 rounded-none bg-white border border-black/15 text-cream placeholder-cream/30 focus:outline-none focus:border-black/40 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-gold text-navy hover:bg-gold/90 px-4 py-2.5 text-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Please wait...' : mode === 'signIn' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-cream/60">
          {mode === 'signIn' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => { setMode('signUp'); setError(''); }} className="text-gold hover:text-gold/80 transition-colors font-medium underline underline-offset-2">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => { setMode('signIn'); setError(''); }} className="text-gold hover:text-gold/80 transition-colors font-medium underline underline-offset-2">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
