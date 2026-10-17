"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { CaseStudyStep } from "@/lib/content";
import { reducedMotion } from "@/lib/utils";
import DeviceFrame from "./DeviceFrame";

const STEP_MS = 3400;

/**
 * A step-by-step walkthrough that plays like a GIF: it advances on its own
 * while in view, pauses on hover or focus, and every step stays clickable.
 * With `autoplay` off it becomes a plain tabbed comparison (e.g. versions).
 */
export default function FlowPlayer({ steps, frame, autoplay = true }: { steps: CaseStudyStep[]; frame: "phone" | "desktop"; autoplay?: boolean }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const running = playing && !hovered && visible;

  useEffect(() => {
    if (reducedMotion()) setPlaying(false);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % steps.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, active, steps.length]);

  const current = steps[active];
  const screen = (
    <>
      {steps.map((step, i) => (
        <img
          key={step.image}
          src={step.image}
          alt={i === active ? step.alt || step.title : ""}
          aria-hidden={i !== active}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform] duration-500 ease-out ${i === active ? "scale-100 opacity-100" : "scale-[1.015] opacity-0"}`}
        />
      ))}
    </>
  );

  const list = (
    <ol className={frame === "phone" ? "grid content-center gap-1.5" : "-mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1"}>
      {steps.map((step, i) => (
        <li key={step.image} className={frame === "phone" ? "" : "min-w-[150px] flex-1 snap-start"}>
          <button
            type="button"
            onClick={() => setActive(i)}
            aria-current={i === active ? "step" : undefined}
            className={`group relative grid w-full gap-1 overflow-hidden rounded-[12px] border px-3.5 py-3 text-left transition-colors ${i === active ? "border-[#e3e3e3] bg-panel" : "border-transparent hover:bg-panel/70"}`}
          >
            <span className="flex items-baseline gap-2">
              <span className={`text-[11px] tabular-nums ${i === active ? "text-ink" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className={`text-[13.5px] font-medium leading-snug ${i === active ? "text-ink" : "text-sub"}`}>{step.title}</span>
            </span>
            {step.description && frame === "phone" && (
              <span className={`pl-7 text-[12.5px] leading-relaxed text-muted ${i === active ? "block" : "hidden sm:block"}`}>{step.description}</span>
            )}
            {autoplay && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#efefef]" aria-hidden="true">
                {i === active && (
                  <span
                    key={`${active}-${running}`}
                    className="flow-progress block h-full bg-ink"
                    style={{ animationDuration: `${STEP_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                  />
                )}
              </span>
            )}
          </button>
        </li>
      ))}
    </ol>
  );

  return (
    <div
      ref={root}
      className="grid gap-4 rounded-[14px] border border-line bg-[#fafafa] p-3 sm:rounded-[18px] sm:p-5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div className={frame === "phone" ? "grid items-center gap-5 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-7" : "grid gap-4"}>
        <DeviceFrame kind={frame}>{screen}</DeviceFrame>
        {list}
      </div>
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-[12px] leading-relaxed text-muted" aria-live="polite">
          {frame === "desktop" && current.description ? current.description : `Step ${active + 1} of ${steps.length}`}
        </p>
        {autoplay && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#e3e3e3] bg-panel text-ink transition-colors hover:bg-bg"
          >
            {playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}
