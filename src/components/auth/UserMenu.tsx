import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { LoginModal } from './LoginModal';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-1.5 border border-cream/25 text-cream text-sm font-medium hover:bg-black/5 transition-colors tracking-wider uppercase text-xs"
        >
          Sign In
        </button>
        <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-gold/30 transition-all"
      >
        <img
          src={user.avatar_url}
          alt={user.display_name}
          className="w-8 h-8 rounded-full object-cover border border-gold/20"
        />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-navy border border-black/10 rounded-none shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-black/10">
            <p className="text-sm font-medium text-cream">{user.display_name}</p>
            <p className="text-xs text-cream/40">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              to="/mypage"
              onClick={() => setShowDropdown(false)}
              className="block px-4 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-black/5 transition-colors"
            >
              My Page
            </Link>
            <button
              onClick={() => { signOut(); setShowDropdown(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-black/5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
