import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-extrabold gradient-text mb-4">404</div>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-muted mb-8 text-sm">This cast doesn&apos;t exist onchain.</p>
      <Link
        href="/feed"
        className="px-6 py-3 bg-accent hover:bg-accent-light text-white font-bold rounded-xl transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
