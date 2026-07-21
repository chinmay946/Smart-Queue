import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/user/profile');
        setProfile(data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-semibold text-white">Profile</h2>
      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm text-slate-400">Name</p>
        <p className="mt-1 text-lg font-semibold text-white">{profile?.name || user?.name}</p>
        <p className="mt-4 text-sm text-slate-400">Email</p>
        <p className="mt-1 text-lg font-semibold text-white">{profile?.email || user?.email}</p>
        <p className="mt-4 text-sm text-slate-400">Role</p>
        <p className="mt-1 text-lg font-semibold text-white">{profile?.role || user?.role}</p>
      </div>
    </div>
  );
}
