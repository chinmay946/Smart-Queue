import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import Spinner from '../components/Spinner';

export default function AdminDashboardPage() {
  const [tokens, setTokens] = useState([]);
  const [stats, setStats] = useState({ waiting: 0, called: 0, skipped: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', page: 1, limit: 10 });
  const { showToast } = useToast();

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/tokens', { params: filters });
      setTokens(data.tokens);
      setStats(data.stats);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to load queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [filters.page]);

  const handleAction = async (endpoint, message, successMessage) => {
    try {
      await api[endpoint.method](endpoint.url);
      showToast(successMessage);
      fetchTokens();
    } catch (error) {
      showToast(error.response?.data?.message || message, 'error');
    }
  };

  const statusClasses = useMemo(() => ({
    Waiting: 'bg-sky-600/20 text-sky-300',
    Called: 'bg-emerald-600/20 text-emerald-300',
    Skipped: 'bg-amber-600/20 text-amber-300',
    Completed: 'bg-slate-700 text-slate-200'
  }), []);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-5">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm capitalize text-slate-400">{key}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">Today's queue</h2>
            <p className="text-sm text-slate-400">Manage tokens, update status, and search live.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleAction({ method: 'put', url: '/admin/call-next' }, 'Call next failed', 'Next token called')} className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white">Call next</button>
            <button onClick={() => handleAction({ method: 'delete', url: '/admin/reset' }, 'Reset failed', 'Queue reset successfully')} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200">Reset queue</button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <input className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Search token or status" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })} />
          <select className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value, page: 1 })}>
            <option value="">All statuses</option>
            <option value="Waiting">Waiting</option>
            <option value="Called">Called</option>
            <option value="Skipped">Skipped</option>
            <option value="Completed">Completed</option>
          </select>
          <button onClick={() => fetchTokens()} className="rounded-full border border-slate-700 px-4 py-2 text-sm">Apply</button>
        </div>

        {loading ? <Spinner /> : (
          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-800/70 text-left text-slate-300">
                <tr>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/70">
                {tokens.map((token) => (
                  <tr key={token._id}>
                    <td className="px-4 py-3 font-medium text-white">#{token.tokenNumber}</td>
                    <td className="px-4 py-3 text-slate-300">{token.user?.name || 'Unknown'}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-3 py-1 text-xs ${statusClasses[token.status]}`}>{token.status}</span></td>
                    <td className="px-4 py-3 text-slate-400">{new Date(token.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleAction({ method: 'put', url: `/admin/complete/${token._id}` }, 'Complete failed', 'Token completed')} className="rounded-full border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">Complete</button>
                        <button onClick={() => handleAction({ method: 'put', url: `/admin/skip/${token._id}` }, 'Skip failed', 'Token skipped')} className="rounded-full border border-amber-500/30 px-3 py-1 text-xs text-amber-300">Skip</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
