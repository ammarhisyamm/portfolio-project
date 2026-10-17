"use client";

import { useState } from "react";
import { MoveHorizontal } from "lucide-react";
import DeviceFrame from "./DeviceFrame";

/** Drag (or use the arrow keys) to wipe between two states of the same screen. */
export default function CompareSlider({
  before,
  after,
  labels,
  alt,
  frame,
}: {
  before: string;
  after: string;
  labels: [string, string];
  alt: string;
  frame: "phone" | "desktop";
}) {
  const [pos, setPos] = useState(50);
  const stage = (
    <div className="absolute inset-0 select-none">
      <img src={after} alt={`${labels[1]}: ${alt}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
      <img
        src={before}
        alt={`${labels[0]}: ${alt}`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-top"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-white backdrop-blur" aria-hidden="true">{labels[0]}</span>
      <span className="absolute right-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-white backdrop-blur" aria-hidden="true">{labels[1]}</span>
      <span className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,.12)]" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-[0_4px_14px_rgba(0,0,0,.25)]">
          <MoveHorizontal size={16} />
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Compare ${labels[0]} and ${labels[1]}`}
        className="compare-range absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
  return (
    <div className="grid gap-3 rounded-[14px] border border-line bg-[#fafafa] p-3 sm:rounded-[18px] sm:p-5">
      <DeviceFrame kind={frame} className={frame === "phone" ? "max-w-[300px]" : ""}>{stage}</DeviceFrame>
      <p className="text-center text-[12px] text-muted">Drag across the screen to compare</p>
    </div>
  );
}
