import type { CSSProperties } from "react";
import { Image as ImageIcon } from "lucide-react";

const SHOTS = [
  "Exploration 01 — Mobile banking",
  "Exploration 02 — Onboarding flow",
  "Exploration 03 — Dashboard UI",
  "Exploration 04 — Design tokens",
  "Exploration 05 — Checkout journey",
  "Exploration 06 — AI chat interface",
  "Exploration 07 — Mobile menu",
  "Exploration 08 — Data visualization",
];

function Frame() {
  return (
    <div className="flex items-center gap-6 pr-6">
      {SHOTS.map((label) => (
        <figure key={label} className="w-60 shrink-0 sm:w-72">
          <div className="aspect-[4/3] overflow-hidden rounded-card border border-line bg-bg">
            <div className="media-ph h-full w-full" role="img" aria-label={`${label} placeholder`}>
              <ImageIcon size={28} strokeWidth={1.4} aria-hidden="true" />
              <span>Design shot</span>
            </div>
          </div>
          <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function DesignExploration() {
  return (
    <section className="grid gap-5">
      <div className="flex items-end justify-between gap-4 px-0.5">
        <span className="kicker">Design exploration</span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.06em] text-muted sm:block">
          Carousel ↻
        </span>
      </div>
      <div className="panel overflow-hidden py-6">
        <div
          className="marquee relative overflow-hidden"
          style={{ "--marquee-duration": "48s" } as CSSProperties}
        >
          <div className="marquee-track flex">
            <Frame />
            <Frame />
          </div>
        </div>
      </div>
    </section>
  );
}