import Link from "next/link";
import { getAllTools, getToolsByCategory } from "@/lib/tools";
import { getAllCategories } from "@/lib/categories";
import ToolGrid from "@/components/tools/ToolGrid";
import CategoryFilter from "@/components/tools/CategoryFilter";
import SearchBar from "@/components/tools/SearchBar";

type Props = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function ToolCatalogPage({ searchParams }: Props) {
  const { category, search } = await searchParams;
  const categories = await getAllCategories();

  const allTools = category
    ? await getToolsByCategory(category)
    : await getAllTools();

  const tools = search
    ? allTools.filter((tool) =>
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase())
      )
    : allTools;

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(17,24,39,0.95)] via-[rgba(9,12,18,0.95)] to-[rgba(9,12,18,0.85)]" />
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 12% 20%, rgba(255,122,47,0.18), transparent 25%), radial-gradient(circle at 90% 10%, rgba(59,130,246,0.12), transparent 26%)" }} />
        <div className="absolute inset-0 noise-overlay" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Browse tools • Ready for pickup now
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight">
                Your project.
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] via-[var(--accent-amber)] to-[#ffd89b]">
                  Our locker wall.
                </span>
              </h1>
              <p className="text-base sm:text-xl text-white/80 max-w-2xl leading-relaxed">
                Pro-grade equipment staged in Orem and accessible 24/7. Filter fast, book in two minutes, and get a code within 90 seconds.
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                {["Same-day pickup", "Smart-lock directions", "No counter line", "Clean & inspected"].map((chip) => (
                  <span key={chip} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 font-semibold">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:justify-self-end w-full">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] space-y-5">
                <div className="text-sm uppercase tracking-[0.2em] text-white/60 mb-3">Quick filters</div>
                <SearchBar initialSearch={search} />
                <CategoryFilter categories={categories} selectedCategory={category} />
                <div className="flex flex-wrap gap-2 text-xs text-white/70">
                  {["Quiet mode", "Indoor safe", "Outdoor", "Compact", "Heavy-duty"].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-white/8 border border-white/10 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        {/* Results Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 mb-3">
              Inventory
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
              {category ? `${category} tools` : "All tools"}
            </h2>
            <p className="text-base text-white/70 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 px-3 py-1.5 rounded-full font-bold text-sm shadow-[0_10px_30px_rgba(255,106,26,0.35)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                {tools.length} {tools.length === 1 ? "Tool" : "Tools"} available
              </span>
              {search && (
                <span className="text-white/50">
                  matching "{search}"
                </span>
              )}
            </p>
          </div>

          {(category || search) && (
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-5 py-3 rounded-xl hover:-translate-y-0.5 transition shadow-[0_12px_35px_rgba(255,255,255,0.16)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </Link>
          )}
        </div>

        {/* Tools Grid */}
        {tools.length > 0 ? (
          <ToolGrid tools={tools} />
        ) : (
          <div className="bg-white/5 rounded-3xl p-16 text-center border border-white/10">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">No tools found</h3>
              <p className="text-white/70 mb-6 text-lg">
                We couldn&apos;t find any tools matching your search. Try adjusting your filters or search terms.
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 font-bold px-8 py-4 rounded-xl hover:-translate-y-0.5 transition shadow-[0_14px_40px_rgba(255,106,26,0.35)]"
              >
                View all tools
              </Link>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {tools.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-[rgba(255,106,26,0.14)] via-[rgba(255,125,47,0.16)] to-[rgba(255,179,71,0.12)] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)" }} />
            <div className="relative">
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Need help choosing?
              </h3>
              <p className="text-xl text-white/80 mb-6 max-w-2xl mx-auto">
                Every tool comes with instant access, directions, and locker numbers. Book now and grab it on your schedule.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/15 transition border border-white/15"
                >
                  How it works
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:-translate-y-0.5 transition shadow-[0_12px_35px_rgba(255,255,255,0.16)]"
                >
                  View inventory
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
