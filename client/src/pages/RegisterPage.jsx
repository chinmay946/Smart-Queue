import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const { user, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await register(form);
      showToast(data.message || 'Registration successful');
      navigate('/dashboard');
    } catch (error) {
      showToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-sky-950/40">
        <h2 className="text-3xl font-semibold text-white">Create your account</h2>
        <p className="mt-2 text-sm text-slate-400">Join Smart Queue and reserve your place quickly.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none" type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button disabled={loading} className="w-full rounded-xl bg-sky-600 px-4 py-3 font-medium text-white disabled:opacity-70">{loading ? 'Please wait...' : 'Register'}</button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-sky-400">Login</Link>
        </p>
      </div>
    </div>
  );
}
