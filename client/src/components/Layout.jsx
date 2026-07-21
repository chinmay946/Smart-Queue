import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, ListChecks, Clock3, History, UserCircle, ShieldCheck, Moon, Sun, LogOut, Ticket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/book-token', label: 'Book Token', icon: Ticket },
  { to: '/queue-status', label: 'Queue Status', icon: ListChecks },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: UserCircle }
];

const adminLinks = [{ to: '/admin/dashboard', label: 'Admin Dashboard', icon: ShieldCheck }];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = user?.role === 'admin' ? [...userLinks, ...adminLinks] : userLinks;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-sky-400">
            <Clock3 className="h-5 w-5" />
            Smart Queue
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="rounded-full border border-slate-700 p-2">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-sm">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link to="/login" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white">Login</Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-4 lg:w-72">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Navigation</p>
          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
