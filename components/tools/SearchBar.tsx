"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  initialSearch?: string;
};

export default function SearchBar({ initialSearch = "" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`/tools${params.toString() ? `?${params.toString()}` : ""}`);
    });
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search tools by name or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(search);
          }
        }}
        className="w-full pl-11 pr-28 py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition"
      />
      <button
        onClick={() => handleSearch(search)}
        disabled={isPending}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 px-4 py-2 rounded-lg font-semibold hover:-translate-y-[1px] transition disabled:opacity-60"
      >
        {isPending ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
