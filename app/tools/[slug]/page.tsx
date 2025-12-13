import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/tools";
import InlineBooking from "@/components/booking/InlineBooking";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ source?: string; listing_id?: string }>;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ToolDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { source, listing_id } = await searchParams;

  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-white">
      {/* Compact Header - Just Breadcrumb */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(17,24,39,0.96)] via-[rgba(9,12,18,0.95)] to-[rgba(10,14,22,0.9)]" />
        <div className="absolute inset-0 noise-overlay" />

        <div className="relative max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <a href="/tools" className="hover:text-white transition">Tools</a>
            <span>/</span>
            <span className="text-white/40">{tool.category.name}</span>
          </div>
        </div>
      </section>

      {/* Main Content - Image First! */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - Image & Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">

            {/* HERO: Image + Tool Name + Price */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
              {/* Tool Image */}
              <div className="relative h-[300px] sm:h-[400px] lg:h-[480px]">
                {tool.imageUrl ? (
                  <img
                    src={tool.imageUrl}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#1b2435] to-[#0f1624]">
                    <div className="text-9xl opacity-30">🔧</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Overlay Info on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-900">
                      {tool.category.name}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                      </span>
                      Available Now
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-3">
                    {tool.name}
                  </h1>

                  <div className="flex items-baseline gap-3 flex-wrap">
                    <div className="text-4xl sm:text-5xl font-black text-white">
                      ${tool.dailyRate.toFixed(0)}
                      <span className="text-lg text-white/70 font-semibold ml-1">/day</span>
                    </div>
                    <div className="text-sm text-white/60">
                      + ${tool.depositAmount.toFixed(0)} deposit (refunded when you return it)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Pickup</p>
                <p className="text-white font-bold">24/7 in Provo</p>
                <p className="text-xs text-white/60 mt-1">Code in 90 seconds</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">What's included</p>
                <p className="text-white font-bold">Ready to use</p>
                <p className="text-xs text-white/60 mt-1">Tools, bits, PPE included</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Support</p>
                <p className="text-white font-bold">Text us anytime</p>
                <p className="text-xs text-white/60 mt-1">Response in minutes</p>
              </div>
            </div>

            {/* About This Tool */}
            {tool.description && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-lg font-black mb-3 text-white">About this tool</h2>
                <p className="text-white/75 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            )}

            {/* How It Works */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-black mb-5 text-white">How it works</h2>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Book online", copy: "Choose your dates and pay. Takes under 2 minutes." },
                  { step: "2", title: "Get your code", copy: "Access code sent to your phone in 90 seconds." },
                  { step: "3", title: "Pick up 24/7", copy: "Show up anytime. Your tool is ready with your name on it." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-amber)] rounded-lg flex items-center justify-center text-slate-900 font-black text-sm shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <h3 className="font-bold mb-0.5 text-white text-sm">{item.title}</h3>
                      <p className="text-sm text-white/70">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Example */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-black mb-3 text-white">Rental cost examples</h2>
              <div className="space-y-2">
                {[1, 3, 5].map((days) => {
                  const rentalCost = tool.dailyRate * days;
                  const total = rentalCost + tool.depositAmount;
                  return (
                    <div key={days} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-white/70">{days} day{days > 1 ? "s" : ""}</span>
                      <div className="text-right">
                        <span className="font-black text-white">${rentalCost.toFixed(0)}</span>
                        <span className="text-xs text-white/50 ml-2">(${total.toFixed(0)} with deposit)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-white/50 mt-3">Deposit refunded in full when you return the tool.</p>
            </div>
          </div>

          {/* RIGHT COLUMN - Sticky Booking (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">

              {/* Booking Widget */}
              <InlineBooking
                tool={tool}
                trafficSource={source}
                trafficListingId={listing_id}
              />

              {/* Trust Badges */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-bold text-white text-sm">Secure payment</div>
                      <div className="text-xs text-white/70">Encrypted checkout</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-bold text-white text-sm">Full deposit refund</div>
                      <div className="text-xs text-white/70">When you return the tool</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-bold text-white text-sm">Free cancellation</div>
                      <div className="text-xs text-white/70">Up to 12 hours before pickup</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[rgba(255,106,26,0.15)] to-[rgba(255,179,71,0.1)] p-5">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="font-bold text-white text-sm">Pickup location</div>
                </div>
                <p className="text-white/90 text-sm font-semibold">1600 N 550 W</p>
                <p className="text-white/90 text-sm font-semibold">Provo, UT 84604</p>
                <p className="text-xs text-white/60 mt-2">Lit lockers • Camera monitored • Open 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
