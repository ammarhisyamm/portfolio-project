import type { CSSProperties } from "react";

function Group({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-6 pr-6">
      {items.map((item) => (
        <span
          key={item}
          className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-panel px-5 py-2.5 text-[13px] text-sub"
        >
          <span className="h-[5px] w-[5px] rounded-full bg-muted" aria-hidden="true" />
          {item}
        </span>
      ))}
    </div>
  );
}

export default function TrustStrip({ items }: { items: string[] }) {
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
        className="marquee relative overflow-hidden py-5"
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