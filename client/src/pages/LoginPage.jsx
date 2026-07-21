import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      showToast(data.message || 'Login successful');
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (error) {
      showToast(error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-sky-950/40">
        <h2 className="text-3xl font-semibold text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-400">Sign in to manage your queue experience.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none ring-0" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none ring-0" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button disabled={loading} className="w-full rounded-xl bg-sky-600 px-4 py-3 font-medium text-white disabled:opacity-70">{loading ? 'Please wait...' : 'Login'}</button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Need an account? <Link to="/register" className="text-sky-400">Create one</Link>
        </p>
      </div>
    </div>
  );
}
