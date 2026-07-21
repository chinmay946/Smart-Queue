import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center">
      <h1 className="text-4xl font-semibold text-white">404</h1>
      <p className="mt-3 text-slate-400">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white">Go home</Link>
    </div>
  );
}
