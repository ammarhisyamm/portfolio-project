import type { CSSProperties } from "react";
import type { TrustItem } from "@/lib/content";

function Group({ items }: { items: TrustItem[] }) {
  return (
    <div className="flex items-center gap-12 pr-12">
      {items.map((logo) => (
        <div key={logo.label} className="flex h-8 shrink-0 items-center justify-center">
          {logo.image ? (
            <img
              src={logo.image}
              alt={logo.label}
              loading="lazy"
              className="h-8 w-auto max-w-[150px] object-contain opacity-70 grayscale transition-opacity duration-300 hover:opacity-100"
            />
          ) : (
            <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
              {logo.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TrustStrip({ items }: { items: TrustItem[] }) {
  const DUPLICATED = [...items, ...items];
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
        <p className="m-0 text-sm leading-normal text-sub">
          Experience across product, UX/UI, and digital experiences.
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.06em] text-muted sm:block">
          Scroll ↻
        </span>
      </div>
      <div
        className="marquee relative overflow-hidden py-7"
        style={{ "--marquee-duration": "70s" } as CSSProperties}
        aria-hidden="true"
      >
        <div className="marquee-track flex">
          {DUPLICATED.map((_, i) => (
            <Group key={i} items={items} />
          ))}
        </div>
      </div>
    </div>
  );
}