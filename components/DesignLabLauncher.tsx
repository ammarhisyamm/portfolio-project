"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hisyam-style-playground";
const defaults = { radius: 12, gap: 16, border: 1, borderColor: "#F4F4F4", background: "#f5f5f5", gradient: false };

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function applyStyles(values: typeof defaults) {
  const root = document.documentElement;
  root.style.setProperty("--site-radius", `${values.radius}px`);
  root.style.setProperty("--site-gap", `${values.gap}px`);
  root.style.setProperty("--site-border-width", `${values.border}px`);
  root.style.setProperty("--site-border-color", values.borderColor);
  root.style.setProperty("--site-bg", values.background);
  root.style.setProperty("--site-bg-image", values.gradient ? "linear-gradient(135deg, rgba(255,255,255,.8), rgba(226,239,231,.8))" : "none");
}

export default function DesignLabLauncher() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(defaults);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      const next = saved ? {
        radius: clamp(saved.radius, 4, 32, defaults.radius),
        gap: clamp(saved.gap, 8, 48, defaults.gap),
        border: clamp(saved.border, 0, 3, defaults.border),
        borderColor: typeof saved.borderColor === "string" ? saved.borderColor : defaults.borderColor,
        background: typeof saved.background === "string" ? saved.background : defaults.background,
        gradient: Boolean(saved.gradient),
      } : defaults;
      setValues(next);
      applyStyles(next);
    } catch {
      applyStyles(defaults);
    }
  }, []);

  function update<K extends keyof typeof defaults>(key: K, value: (typeof defaults)[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    applyStyles(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* preview still works */ }
  }

  function reset() {
    setValues(defaults);
    applyStyles(defaults);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults)); } catch { /* preview still works */ }
  }

  return (
    <div className="design-lab-launcher">
      {open && (
        <div className="design-lab-popover" role="dialog" aria-label="Edit site style">
          <div className="flex items-start justify-between gap-5">
            <div>
              <span className="kicker">Design Lab</span>
              <h2 className="mt-2 text-base font-medium">Edit this preview</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-lg text-muted" aria-label="Close style editor">×</button>
          </div>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-xs" htmlFor="global-radius"><span className="flex justify-between">Section radius <output>{values.radius}px</output></span><input id="global-radius" type="range" min="4" max="32" value={values.radius} onChange={(event) => update("radius", Number(event.target.value))} /></label>
            <label className="grid gap-2 text-xs" htmlFor="global-gap"><span className="flex justify-between">Section spacing <output>{values.gap}px</output></span><input id="global-gap" type="range" min="8" max="48" step="2" value={values.gap} onChange={(event) => update("gap", Number(event.target.value))} /></label>
            <label className="grid gap-2 text-xs" htmlFor="global-border"><span className="flex justify-between">Border weight <output>{values.border}px</output></span><input id="global-border" type="range" min="0" max="3" step="1" value={values.border} onChange={(event) => update("border", Number(event.target.value))} /></label>
            <label className="flex items-center justify-between gap-3 text-xs" htmlFor="global-border-color"><span>Border color</span><input id="global-border-color" type="color" value={values.borderColor} onChange={(event) => update("borderColor", event.target.value)} /></label>
            <label className="flex items-center justify-between gap-3 text-xs" htmlFor="global-background"><span>Background</span><input id="global-background" type="color" value={values.background} onChange={(event) => update("background", event.target.value)} /></label>
            <label className="flex items-center justify-between gap-3 text-xs" htmlFor="global-gradient"><span>Soft gradient</span><input id="global-gradient" type="checkbox" checked={values.gradient} onChange={(event) => update("gradient", event.target.checked)} /></label>
          </div>
          <button type="button" onClick={reset} className="mt-5 w-full text-xs text-sub underline underline-offset-4">Reset styles</button>
        </div>
      )}
      <button type="button" className="design-lab-trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span aria-hidden="true">✦</span> Edit style
      </button>
    </div>
  );
}
