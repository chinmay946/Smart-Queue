import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import Spinner from '../components/Spinner';

export default function QueueStatusPage() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const { data } = await api.get('/token/live');
        setTokens(data.tokens);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.on('queue:update', fetchQueue);

    return () => socket.disconnect();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-white">Live queue status</h2>
        <p className="text-sm text-slate-400">Updates happen instantly through Socket.IO.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-800/70 text-left text-slate-300">
            <tr>
              <th className="px-4 py-3">Token</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/70">
            {tokens.map((token) => (
              <tr key={token._id}>
                <td className="px-4 py-3 font-medium text-white">#{token.tokenNumber}</td>
                <td className="px-4 py-3 text-slate-300">{token.user?.name || 'Unknown'}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{token.status}</span>
                </td>
                <td className="px-4 py-3 text-slate-400">{new Date(token.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
