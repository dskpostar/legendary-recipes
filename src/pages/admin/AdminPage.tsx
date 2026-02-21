import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';

const ADMIN_LINKS = [
  { to: '/admin/recipes', label: 'Recipes' },
  { to: '/admin/chefs', label: 'Chefs' },
  { to: '/admin/collections', label: 'Collections' },
  { to: '/admin/comments', label: 'Comments' },
  { to: '/admin/users', label: 'Users' },
];

export function AdminPage() {
  const { isAdmin, isAuthReady } = useAuth();

  if (!isAuthReady) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40 text-sm">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-white/10 flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {ADMIN_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <NavLink
            to="/"
            className="px-3 py-2 rounded text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-colors block"
          >
            ← Back to Site
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
