"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hisyam-style-playground";
const DEFAULT_RADIUS = 12;
const DEFAULT_GAP = 16;

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

export default function StylePlayground() {
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [gap, setGap] = useState(DEFAULT_GAP);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved) {
        setRadius(clamp(saved.radius, 4, 32, DEFAULT_RADIUS));
        setGap(clamp(saved.gap, 8, 48, DEFAULT_GAP));
      }
    } catch {
      // Keep defaults when local storage is unavailable.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ radius, gap }));
    } catch {
      // The controls still work for this session.
    }
  }, [radius, gap, loaded]);

  async function copyCss() {
    const css = `.btn { border-radius: ${radius}px; }\n.page-sections { gap: ${gap}px; }`;
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="grid gap-3 md:gap-4">
      <section className="panel p-5 sm:p-8" aria-labelledby="controls-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="controls-title" className="text-xl font-normal tracking-[-0.04em]">Adjust the details</h2>
            <p className="mt-2 text-sm text-sub">Your changes are saved in this browser for the playground preview.</p>
          </div>
          <button
            type="button"
            className="text-sm text-sub underline underline-offset-4 hover:text-ink"
            onClick={() => { setRadius(DEFAULT_RADIUS); setGap(DEFAULT_GAP); }}
          >
            Reset
          </button>
        </div>
        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <label className="grid gap-3 text-sm" htmlFor="button-radius">
            <span className="flex justify-between gap-3"><span>Button radius</span><output className="tabular-nums text-sub">{radius}px</output></span>
            <input id="button-radius" type="range" min="4" max="32" step="1" value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="w-full accent-[#161616]" />
            <span className="text-xs text-muted">From crisp corners to a softer shape.</span>
          </label>
          <label className="grid gap-3 text-sm" htmlFor="section-gap">
            <span className="flex justify-between gap-3"><span>Section spacing</span><output className="tabular-nums text-sub">{gap}px</output></span>
            <input id="section-gap" type="range" min="8" max="48" step="2" value={gap} onChange={(event) => setGap(Number(event.target.value))} className="w-full accent-[#161616]" />
            <span className="text-xs text-muted">The space between content cards.</span>
          </label>
        </div>
      </section>

      <section className="panel p-5 sm:p-8" aria-labelledby="preview-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="preview-title" className="text-xl font-normal tracking-[-0.04em]">Live preview</h2>
            <p className="mt-2 text-sm text-sub">Move the sliders to compare the look.</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={copyCss}>
            {copied ? "CSS copied" : "Copy CSS"}
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 border-b border-line pb-7">
          <button type="button" className="btn btn-primary" style={{ borderRadius: radius }}>Primary button</button>
          <button type="button" className="btn btn-secondary" style={{ borderRadius: radius }}>Secondary button</button>
        </div>
        <div className="mt-7 grid" style={{ gap }}>
          <div className="rounded-[18px] border border-line bg-bg p-5">
            <span className="kicker">Introduction</span>
            <p className="mt-2 text-sm text-sub">A clear opening and a focused message.</p>
          </div>
          <div className="rounded-[18px] border border-line bg-bg p-5">
            <span className="kicker">Selected work</span>
            <p className="mt-2 text-sm text-sub">Projects with room to breathe.</p>
          </div>
          <div className="rounded-[18px] border border-line bg-bg p-5">
            <span className="kicker">About</span>
            <p className="mt-2 text-sm text-sub">A compact introduction to the person behind the work.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
