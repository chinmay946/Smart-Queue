import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import api from "../services/api";
import Spinner from "../components/Spinner";

export default function DashboardPage() {
  const [stats, setStats] = useState({ recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: myData } = await api.get("/token/my");
        setStats({
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
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Quick actions</h2>
            <p className="text-sm text-slate-400">
              Book a new token or review your recent activity.
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
