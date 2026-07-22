import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  { title: 'Fast booking', description: 'Book a token in seconds and track your place live.' },
  { title: 'Smart admin controls', description: 'Call, skip, complete, or reset the queue instantly.' },
  { title: 'Real-time visibility', description: 'Socket updates keep everyone informed without refresh.' }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_45%)] bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-16 lg:px-8">
        <nav className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold text-sky-400">
            <Sparkles className="h-5 w-5" />
            Smart Queue
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="rounded-full border border-slate-700 px-4 py-2 text-sm">Login</Link>
            <Link to="/register" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white">Register</Link>
          </div>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-700/60 bg-sky-900/20 px-3 py-1 text-sm text-sky-300">
              <ShieldCheck className="h-4 w-4" />
              Production-ready queue management for modern teams
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Replace long waits with a smart, live queue experience.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Smart Queue helps customers book tokens, track progress, and receive real-time updates while admins manage service flow smoothly.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 font-medium text-white">Get started <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/admin/login" className="rounded-full border border-slate-700 px-5 py-3 font-medium text-slate-200">Admin access</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
