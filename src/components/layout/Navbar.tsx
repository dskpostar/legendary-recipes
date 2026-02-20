import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { UserMenu } from '../auth/UserMenu';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="font-display text-2xl font-bold text-cream tracking-[0.25em] uppercase">
              The Recipe
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-gold'
                    : 'text-cream/60 hover:text-cream'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <UserMenu />
          </div>

          {/* Mobile: UserMenu + hamburger */}
          <div className="sm:hidden flex items-center gap-3">
            <UserMenu />
            <button
              className="text-cream/60 hover:text-cream"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="sm:hidden pb-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.to
                    ? 'text-gold bg-gold/5'
                    : 'text-cream/60 hover:text-cream hover:bg-black/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
