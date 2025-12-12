"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  selectedCategory?: string;
};

export default function CategoryFilter({ categories, selectedCategory }: Props) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const createHref = (categorySlug?: string) => {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (search) params.set("search", search);
    return `/tools${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={createHref()}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
          !selectedCategory
            ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 border-transparent shadow-[0_12px_30px_rgba(255,106,26,0.35)]"
            : "bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border-white/15"
        )}
      >
        All Tools
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={createHref(category.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
            selectedCategory === category.slug
              ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 border-transparent shadow-[0_12px_30px_rgba(255,106,26,0.35)]"
              : "bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border-white/15"
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
