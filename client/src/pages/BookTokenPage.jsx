import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function BookTokenPage() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/token/book');
      showToast(`Token #${data.token.tokenNumber} booked successfully`);
      navigate('/queue-status');
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to book token', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <h2 className="text-2xl font-semibold text-white">Book a queue token</h2>
      <p className="mt-2 text-sm text-slate-400">Reserve your turn and follow your place in the live queue.</p>
      <form onSubmit={handleSubmit} className="mt-8 max-w-md rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm text-slate-400">You are about to book the next available token.</p>
        <button disabled={loading} className="mt-6 w-full rounded-full bg-sky-600 px-4 py-3 font-medium text-white disabled:opacity-70">{loading ? 'Booking...' : 'Book Token'}</button>
      </form>
    </div>
  );
}
