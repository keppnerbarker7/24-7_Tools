import Link from "next/link";

export default async function Home() {

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(17,24,39,0.95)] via-[rgba(9,12,18,0.95)] to-[rgba(17,24,39,0.9)]" />
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, rgba(255,122,47,0.16), transparent 25%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.18), transparent 30%)" }} />
        <div className="absolute inset-0 noise-overlay" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-semibold">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                24/7 Self-Service • Code in 90 seconds
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                  Heavy-duty tools
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-[var(--accent-amber)] to-[#ffd89b]">
                    without the counter line.
                  </span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-2xl leading-relaxed">
                  Book online, get your smart-lock code instantly, and pull your gear any hour—no paperwork, no staff, no waiting.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <Link
                  href="/tools"
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 font-black px-10 py-4 rounded-2xl shadow-[0_20px_50px_rgba(255,106,26,0.35)] hover:shadow-[0_24px_60px_rgba(255,106,26,0.45)] hover:-translate-y-0.5 transition-all text-lg"
                >
                  Browse all tools
                  <svg
                    className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Link
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition"
                  >
                    See how it works
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <span className="text-xs uppercase tracking-[0.24em] text-white/50">
                    Directions included after booking
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { title: "Instant code", text: "Delivered in 90 seconds after payment." },
                  { title: "Locker pickup", text: "Pull gear 24/7 in Orem, UT." },
                  { title: "Pro-grade", text: "Cleaned, inspected, fuelled, ready." },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-white/50 mb-1">{item.title}</div>
                    <div className="text-sm text-white/80">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-16 w-64 h-64 bg-gradient-to-br from-[var(--accent)]/35 to-[var(--accent-amber)]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-12 w-48 h-48 bg-gradient-to-tr from-sky-500/25 to-blue-700/15 rounded-full blur-3xl" />
              <div className="relative rounded-[28px] overflow-hidden border border-white/10 bg-gradient-to-br from-[#161d2a] to-[#0d1118] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%)" }} />
                <img
                  src="/images/pressure-washer.png"
                  alt="Tool locker"
                  className="w-full h-[420px] object-cover brightness-[1.05] contrast-[1.05]"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/60">Locker ETA</p>
                      <p className="text-lg font-black">Code delivered in 90s</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 font-black grid place-items-center shadow-[0_10px_30px_rgba(255,106,26,0.35)]">
                        24/7
                      </span>
                      <Link href="/tools" className="text-sm font-semibold text-white/80 hover:text-white underline underline-offset-4">
                        See inventory
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-gradient-to-b from-[var(--bg-deep)] to-[var(--bg-soft)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-white/8 border border-white/10 grid place-items-center font-black text-[var(--accent)]">↺</div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">No friction</p>
              <h2 className="text-3xl sm:text-5xl font-black leading-tight">How the locker flow works</h2>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Book online in under 2 minutes",
                detail: "Pick dates, pay, and get a receipt. No counter forms or phone calls.",
                meta: "Takes 120s • Stripe secured",
              },
              {
                step: "2",
                title: "Instant smart-lock code",
                detail: "We email and text your door + locker code. Directions are included.",
                meta: "Code in ~90s • Works 24/7",
              },
              {
                step: "3",
                title: "Grab and go at the locker",
                detail: "Show up whenever. Gear is staged, fueled, and labeled with your name.",
                meta: "Lighting on site • Quiet pickup",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-7 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(120deg, rgba(255,106,26,0.16), transparent 45%)" }} />
                <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 font-black grid place-items-center shadow-[0_12px_35px_rgba(255,106,26,0.35)]">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-white/50">Step {item.step}</p>
                      <h3 className="text-xl sm:text-2xl font-black leading-tight">{item.title}</h3>
                    </div>
                  </div>
                  <div className="flex-1 text-white/75 leading-relaxed">{item.detail}</div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/70">
                    {item.meta}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-[rgba(255,106,26,0.08)] via-[rgba(255,125,47,0.12)] to-[rgba(255,179,71,0.08)] p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-white/60">What you get</p>
              <div className="flex flex-wrap gap-3 mt-3">
                {["Locker code", "Locker number", "Directions", "Support text"].map((chip) => (
                  <span key={chip} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-sm font-semibold">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 font-black hover:-translate-y-0.5 transition shadow-[0_12px_35px_rgba(255,255,255,0.18)]"
            >
              View inventory
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
