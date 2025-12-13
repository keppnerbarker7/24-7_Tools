import { notFound } from "next/navigation";
import { getToolBySlug, getAllTools } from "@/lib/tools";
import InlineBooking from "@/components/booking/InlineBooking";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ source?: string; listing_id?: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { source, listing_id } = await searchParams;

  const tool = await getToolBySlug(slug);
  const costPreview = [1, 3, 5].map((days) => ({
    days,
    total: tool ? tool.dailyRate * days + tool.depositAmount : 0,
  }));

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(17,24,39,0.96)] via-[rgba(9,12,18,0.95)] to-[rgba(10,14,22,0.9)]" />
        <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "radial-gradient(circle at 18% 20%, rgba(255,122,47,0.16), transparent 26%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.16), transparent 30%)" }} />
        <div className="absolute inset-0 noise-overlay" />

        <div className="relative max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 sm:py-14">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/15">
                  {tool.category.name}
                </span>
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 shadow-[0_10px_30px_rgba(255,106,26,0.3)]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  Available
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05]">
                {tool.name}
              </h1>
              <p className="text-lg text-white/75 max-w-2xl">
                Pick up from the locker any hour. Cleaned, inspected, and staged with your name on it. Skip the wait—just book, get your code, and go.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                {["Access code in 90s", "Pickup in Provo", "Fuelled/charged", "Secure payment"].map((chip) => (
                  <span key={chip} className="px-3 py-1.5 rounded-full bg-white/8 border border-white/10 font-semibold">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] bg-clip-text text-transparent mb-2">
                ${tool.dailyRate.toFixed(2)}
              </div>
              <div className="text-white/60 text-sm">
                per day + ${tool.depositAmount.toFixed(2)} deposit
              </div>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Self-serve pickup • Open now
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left - Image & Details */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="md:col-span-3 relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                {tool.imageUrl ? (
                  <img
                    src={tool.imageUrl}
                    alt={tool.name}
                    className="w-full h-[380px] sm:h-[460px] object-cover"
                  />
                ) : (
                  <div className="h-[380px] sm:h-[460px] flex items-center justify-center bg-gradient-to-br from-[#1b2435] to-[#0f1624]">
                    <div className="text-7xl opacity-30">🔧</div>
                  </div>
                )}
                <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 45%)" }} />
              </div>
              <div className="md:col-span-2 grid grid-rows-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Cost simulator</p>
                  <div className="space-y-3">
                    {costPreview.map((item) => (
                      <div key={item.days} className="flex items-center justify-between text-sm">
                        <span className="text-white/70">{item.days} day{item.days > 1 ? "s" : ""}</span>
                        <span className="font-black text-white">${item.total.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/50 mt-3">Totals include refundable deposit.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[rgba(255,106,26,0.18)] to-[rgba(255,179,71,0.12)] p-4 text-slate-900">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/80 mb-2">Pickup status</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-lg font-black">Access code in ~90s</p>
                      <p className="text-white/70 text-sm">Clear directions + locker number included</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-white text-slate-900 font-black grid place-items-center shadow-[0_12px_35px_rgba(255,255,255,0.25)]">
                      24/7
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: "What's included", detail: "Tools, bits, hoses, and PPE where applicable." },
                { title: "Pickup time", detail: "Pick up anytime—lockers lit and camera monitored." },
                { title: "Support", detail: "Text us if you need a tip. We respond in minutes." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">{item.title}</p>
                  <p className="text-white/80 text-sm leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>

            {tool.description && (
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <h2 className="text-xl font-black mb-3 text-white">About this tool</h2>
                <p className="text-white/75 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            )}

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
              <h2 className="text-xl font-black mb-6 text-white">How it works</h2>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Book & pay", copy: "Choose your dates and pay online. Takes under 2 minutes." },
                  { step: "2", title: "Get access code instantly", copy: "Door + locker access code sent to email and text in ~90 seconds." },
                  { step: "3", title: "Pick up anytime", copy: "Show up when you want. Your tool is staged with your name on it." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-amber)] rounded-lg flex items-center justify-center text-slate-900 font-black shadow-[0_10px_30px_rgba(255,106,26,0.3)]">
                      {item.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-bold mb-1 text-white">{item.title}</h3>
                      <p className="text-sm text-white/70">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Sticky Booking */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              <InlineBooking
                tool={tool}
                trafficSource={source}
                trafficListingId={listing_id}
              />

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-bold text-white">Payment protected</div>
                    <div className="text-sm text-white/70">Secure payment • Full deposit refund</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-white/70">Cancel free up to 12h before pickup.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
