"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 bg-[rgba(13,16,23,0.9)]">
      <div className="border-b border-white/10 bg-[rgba(255,106,26,0.08)] text-sm text-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              Open 24/7
            </span>
            <span className="hidden sm:flex items-center gap-2 text-white/70">
              <span className="h-1 w-1 rounded-full bg-white/30" />
              1600 N 550 W, Provo, UT 84604
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:385-475-5398"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15 transition text-xs sm:text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h1.28a2 2 0 011.94 1.515l.36 1.44a2 2 0 01-.45 1.832l-1.12 1.12a16 16 0 007.072 7.072l1.12-1.12a2 2 0 011.832-.45l1.44.36A2 2 0 0119 17.72V19a2 2 0 01-2 2h-1C8.82 21 3 15.18 3 8V5z" />
              </svg>
              <span className="hidden sm:inline">(385) 475-5398</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-amber)] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(255,106,26,0.35)] group-hover:shadow-[0_14px_40px_rgba(255,106,26,0.45)] transition-all group-hover:-translate-y-0.5">
              <div className="text-white font-black text-base leading-none">
                24/7
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-white leading-tight">
                24/7 Tool Locker
              </span>
              <span className="text-xs text-white/60 font-semibold leading-tight">
                Utah Valley Rentals
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/"
              className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all ${
                isActive("/")
                  ? "bg-white text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Home
            </Link>
            <Link
              href="/tools"
              className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all ${
                isActive("/tools") || pathname.startsWith("/tools/")
                  ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] text-white shadow-[0_12px_35px_rgba(255,106,26,0.35)]"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Tools
            </Link>
            <Link
              href="/admin"
              className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all ${
                isActive("/admin") || pathname.startsWith("/admin/")
                  ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_12px_35px_rgba(56,189,248,0.3)]"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="hidden sm:inline">Admin</span>
              <span className="sm:hidden">👤</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
