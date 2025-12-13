import Link from "next/link";
import { ToolWithCategory } from "@/types";

type Props = {
  tools: ToolWithCategory[];
};

export default function ToolGrid({ tools }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => {
        if (!tool.slug) {
          console.error("Tool missing slug:", tool);
          return null;
        }

        return (
        <Link
          key={tool.id}
          href={`/tools/${tool.slug}`}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 transition-all shadow-[0_18px_45px_rgba(0,0,0,0.35)] hover:-translate-y-1"
        >
          <div className="relative h-48 sm:h-52 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,106,26,0.08)] to-transparent opacity-70" />
            {tool.imageUrl ? (
              <img
                src={tool.imageUrl}
                alt={tool.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900/40">
                <span className="text-white/50">No image</span>
              </div>
            )}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-slate-900 text-xs font-semibold shadow-sm">
                {tool.category.name}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold border border-white/15">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Access code in 90s
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-lg text-white leading-tight">{tool.name}</h3>
                <p className="text-sm text-white/70 line-clamp-2">{tool.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-white">
                  ${tool.dailyRate.toFixed(0)}
                  <span className="text-xs font-semibold text-white/60">/day</span>
                </div>
                <p className="text-[11px] text-white/50">
                  + ${tool.depositAmount.toFixed(0)} deposit
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/60">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-semibold">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                24/7 Locker pickup
              </div>
              <span className="text-[var(--accent-amber)] font-semibold">View details →</span>
            </div>
          </div>
        </Link>
        );
      })}
    </div>
  );
}
