import type { CSSProperties } from "react";
import type { ExplorationItem } from "@/lib/content";
import Media from "./Media";

function Frame({ items }: { items: ExplorationItem[] }) {
  return (
    <div className="flex items-center gap-6 pr-6">
      {items.map((shot) => (
        <figure key={shot.label} className="w-60 shrink-0 sm:w-72">
          <div className="aspect-[4/3] overflow-hidden rounded-[18px] border border-line bg-bg sm:rounded-[22px] lg:rounded-[24px]">
            <Media
              src={shot.image}
              alt={shot.label}
              label={shot.label}
              imgClassName="h-full w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
            {shot.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function DesignExploration({ items }: { items: ExplorationItem[] }) {
  return (
    <section className="grid gap-3">
      <div className="flex items-end justify-between gap-4 px-0.5">
        <span className="kicker">Design exploration</span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.06em] text-muted sm:block">
          Carousel ↻
        </span>
      </div>
      <div className="panel overflow-hidden py-6">
        <div
          className="marquee relative overflow-hidden"
          style={{ "--marquee-duration": "120s" } as CSSProperties}
        >
          <div className="marquee-track flex">
            <Frame items={items} />
            <Frame items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}