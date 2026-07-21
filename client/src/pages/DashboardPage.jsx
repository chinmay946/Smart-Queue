import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Ticket, ListChecks, Clock3 } from "lucide-react";
import api from "../services/api";
import Spinner from "../components/Spinner";

export default function DashboardPage() {
  const [stats, setStats] = useState({ pending: 0, active: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [{ data: liveData }, { data: myData }] = await Promise.all([
          api.get("/token/live"),
          api.get("/token/my"),
        ]);
        setStats({
          pending: liveData.tokens.filter((token) => token.status === "Waiting")
            .length,
          active: liveData.tokens.filter((token) => token.status === "Called")
            .length,
          recent: myData.tokens.slice(0, 5),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Waiting tokens</p>
            <Ticket className="h-5 w-5 text-sky-400" />
          </div>
          <p className="mt-4 text-3xl font-semibold">{stats.pending}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Currently called</p>
            <ListChecks className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-4 text-3xl font-semibold">{stats.active}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Recent activity</p>
            <Clock3 className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-4 text-3xl font-semibold">{stats.recent.length}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Quick actions</h2>
            <p className="text-sm text-slate-400">
              Book a new token or check the live queue.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/book-token"
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white"
          >
            Book a new token
          </Link>
          <Link
            to="/queue-status"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200"
          >
            View live status
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent tokens</h2>
          <Link
            to="/history"
            className="flex items-center gap-1 text-sm text-sky-400"
          >
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {stats.recent.map((token) => (
            <div
              key={token._id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">
                  Token #{token.tokenNumber}
                </p>
                <p className="text-sm text-slate-400">
                  {new Date(token.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                {token.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
