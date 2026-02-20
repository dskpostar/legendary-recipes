import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../lib/auth-context';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, signUp, isLoading } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

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
