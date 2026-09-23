"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Eye, SlidersHorizontal, X } from "lucide-react";

const STORAGE_KEY = "hisyam-style-playground";
const defaults = { radiusTL: 12, radiusTR: 12, radiusBR: 12, radiusBL: 12, gap: 16, border: 1, borderColor: "#F4F4F4", background: "#f5f5f5", gradient: false };
type StyleValues = typeof defaults;

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function applyStyles(values: StyleValues) {
  const root = document.documentElement;
  root.style.setProperty("--site-radius", `${values.radiusTL}px ${values.radiusTR}px ${values.radiusBR}px ${values.radiusBL}px`);
  root.style.setProperty("--site-gap", `${values.gap}px`);
  root.style.setProperty("--site-border-width", `${values.border}px`);
  root.style.setProperty("--site-border-color", values.borderColor);
  root.style.setProperty("--site-bg", values.background);
  root.style.setProperty("--site-bg-image", values.gradient ? "linear-gradient(135deg, rgba(255,255,255,.8), rgba(226,239,231,.8))" : "none");
}

function savedValues(saved: Record<string, unknown> | null): StyleValues {
  const radius = clamp(saved?.radius, 4, 32, defaults.radiusTL);
  return {
    radiusTL: clamp(saved?.radiusTL, 0, 48, radius), radiusTR: clamp(saved?.radiusTR, 0, 48, radius),
    radiusBR: clamp(saved?.radiusBR, 0, 48, radius), radiusBL: clamp(saved?.radiusBL, 0, 48, radius),
    gap: clamp(saved?.gap, 8, 48, defaults.gap), border: clamp(saved?.border, 0, 3, defaults.border),
    borderColor: typeof saved?.borderColor === "string" ? saved.borderColor : defaults.borderColor,
    background: typeof saved?.background === "string" ? saved.background : defaults.background,
    gradient: Boolean(saved?.gradient),
  };
}

export default function DesignLabLauncher() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<StyleValues>(defaults);

  useEffect(() => {
    try {
      const next = savedValues(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"));
      setValues(next); applyStyles(next);
    } catch { applyStyles(defaults); }
  }, []);

  function update<K extends keyof StyleValues>(key: K, value: StyleValues[K]) {
    const next = { ...values, [key]: value };
    setValues(next); applyStyles(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* preview still works */ }
  }

  function reset() {
    setValues(defaults); applyStyles(defaults);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults)); } catch { /* preview still works */ }
  }

  return (
    <div className="design-lab-launcher">
      {open && (
        <aside className="design-lab-panel" role="dialog" aria-label="Edit site style">
          <header className="design-lab-panel-header">
            <div><span className="kicker">Design Lab</span><h2>Appearance</h2></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close style editor"><X size={18} /></button>
          </header>
          <section className="design-lab-section">
            <div className="design-lab-section-tools"><Eye size={20} /><SlidersHorizontal size={20} /></div>
            <div className="design-lab-control-grid">
              <label className="design-lab-field"><span>Radius top left</span><input aria-label="Radius top left" type="number" min="0" max="48" value={values.radiusTL} onChange={(event) => update("radiusTL", clamp(event.target.value, 0, 48, values.radiusTL))} /></label>
              <label className="design-lab-field"><span>Radius top right</span><input aria-label="Radius top right" type="number" min="0" max="48" value={values.radiusTR} onChange={(event) => update("radiusTR", clamp(event.target.value, 0, 48, values.radiusTR))} /></label>
              <label className="design-lab-field"><span>Radius bottom right</span><input aria-label="Radius bottom right" type="number" min="0" max="48" value={values.radiusBR} onChange={(event) => update("radiusBR", clamp(event.target.value, 0, 48, values.radiusBR))} /></label>
              <label className="design-lab-field"><span>Radius bottom left</span><input aria-label="Radius bottom left" type="number" min="0" max="48" value={values.radiusBL} onChange={(event) => update("radiusBL", clamp(event.target.value, 0, 48, values.radiusBL))} /></label>
            </div>
            <label className="design-lab-slider"><span>Section spacing <output>{values.gap}px</output></span><input type="range" min="8" max="48" step="2" value={values.gap} onChange={(event) => update("gap", Number(event.target.value))} /></label>
          </section>
          <section className="design-lab-section"><h3>Fill</h3>
            <label className="design-lab-color-row"><span className="color-swatch" style={{ backgroundColor: values.background }} /><span>Background</span><input aria-label="Background color" type="color" value={values.background} onChange={(event) => update("background", event.target.value)} /><ChevronDown size={16} /></label>
            <label className="design-lab-check"><input type="checkbox" checked={values.gradient} onChange={(event) => update("gradient", event.target.checked)} /> Use soft gradient</label>
          </section>
          <section className="design-lab-section"><h3>Stroke</h3>
            <label className="design-lab-color-row"><span className="color-swatch" style={{ backgroundColor: values.borderColor }} /><span>Border color</span><input aria-label="Border color" type="color" value={values.borderColor} onChange={(event) => update("borderColor", event.target.value)} /><X size={16} /></label>
            <label className="design-lab-slider"><span>Weight <output>{values.border}px</output></span><input type="range" min="0" max="3" step="1" value={values.border} onChange={(event) => update("border", Number(event.target.value))} /></label>
            <div className="design-lab-select"><span>Inside</span><ChevronDown size={16} /></div>
          </section>
          <footer className="design-lab-panel-footer"><button type="button" onClick={reset}>Reset styles</button><a href="/design-lab">Open full lab ↗</a></footer>
        </aside>
      )}
      <button type="button" className="design-lab-trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open}><span aria-hidden="true">✦</span> Edit style</button>
    </div>
  );
}
