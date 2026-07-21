import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const showDefaultAdminHint = import.meta.env.DEV;

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
      if (data.user.role !== 'admin') {
        showToast('This account is not an admin account', 'error');
        return;
      }
      showToast('Admin login successful');
      navigate('/admin/dashboard');
    } catch (error) {
      showToast(error.response?.data?.message || 'Admin login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-sky-950/40">
        <h2 className="text-3xl font-semibold text-white">Admin portal</h2>
        <p className="mt-2 text-sm text-slate-400">Secure access for queue supervisors.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none" type="email" placeholder="Admin email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button disabled={loading} className="w-full rounded-xl bg-sky-600 px-4 py-3 font-medium text-white disabled:opacity-70">{loading ? 'Please wait...' : 'Enter admin dashboard'}</button>
        </form>
        {showDefaultAdminHint && (
          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-300">
            <p className="font-semibold text-slate-100">Default admin credentials</p>
            <p>Email: <span className="text-sky-400">admin@smartqueue.local</span></p>
            <p>Password: <span className="text-sky-400">Admin123!</span></p>
          </div>
        )}
        <p className="mt-4 text-sm text-slate-400">
          Back to <Link to="/login" className="text-sky-400">customer login</Link>
        </p>
      </div>
    </div>
  );
}
