"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ImagePlus, X } from "lucide-react";

type BackgroundType = "color" | "gradient" | "image";
type ShadowType = "drop" | "inner";

const defaults = {
  radiusTL: 12, radiusTR: 12, radiusBR: 12, radiusBL: 12, gap: 16, border: 1,
  borderColor: "#F4F4F4", background: "#f5f5f5", backgroundType: "color" as BackgroundType,
  shadowEnabled: false, shadowType: "drop" as ShadowType, shadowX: 0, shadowY: 4,
  shadowBlur: 16, shadowSpread: 0, shadowColor: "#000000", shadowOpacity: 18,
};
type StyleValues = typeof defaults;

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function hexToRgba(hex: string, opacity: number) {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

function applyStyles(values: StyleValues, imageUrl: string | null) {
  const root = document.documentElement;
  const imageLayer = imageUrl
    ? `linear-gradient(rgba(245, 245, 245, .15), rgba(245, 245, 245, .15)), url("${imageUrl}")`
    : "none";
  const backgroundImage = values.backgroundType === "gradient"
    ? "linear-gradient(135deg, rgba(255,255,255,.84), rgba(214,234,221,.9))"
    : values.backgroundType === "image" ? imageLayer : "none";
  root.style.setProperty("--site-radius", `${values.radiusTL}px ${values.radiusTR}px ${values.radiusBR}px ${values.radiusBL}px`);
  root.style.setProperty("--site-gap", `${values.gap}px`);
  root.style.setProperty("--site-border-width", `${values.border}px`);
  root.style.setProperty("--site-border-color", values.borderColor);
  root.style.setProperty("--site-bg", values.background);
  root.style.setProperty("--site-bg-image", backgroundImage);
  const shadow = `${values.shadowType === "inner" ? "inset " : ""}${values.shadowX}px ${values.shadowY}px ${values.shadowBlur}px ${values.shadowSpread}px ${hexToRgba(values.shadowColor, values.shadowOpacity)}`;
  root.style.setProperty("--site-panel-shadow", values.shadowEnabled ? shadow : "none");
}

export default function DesignLabLauncher() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<StyleValues>(defaults);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const imageUrlRef = useRef<string | null>(null);

  // No localStorage by design: new visits always begin with the portfolio default.
  useEffect(() => {
    applyStyles(defaults, null);
    return () => {
      applyStyles(defaults, null);
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    };
  }, []);

  useEffect(() => { applyStyles(values, imageUrl); }, [imageUrl, values]);

  function update<K extends keyof StyleValues>(key: K, value: StyleValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function clearImage() {
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    imageUrlRef.current = null;
    setImageUrl(null);
    setImageName("");
    update("backgroundType", "color");
  }

  function selectImage(file: File | undefined) {
    if (!file) return;
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    const nextUrl = URL.createObjectURL(file);
    imageUrlRef.current = nextUrl;
    setImageUrl(nextUrl);
    setImageName(file.name);
    update("backgroundType", "image");
  }

  function reset() {
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    imageUrlRef.current = null;
    setImageUrl(null);
    setImageName("");
    setValues(defaults);
  }

  return (
    <div className="design-lab-launcher">
      {open && (
        <aside className="design-lab-panel" data-lenis-prevent role="dialog" aria-label="Edit site style">
          <header className="design-lab-panel-header">
            <div><span className="kicker">Design Lab</span><h2>Appearance</h2></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close style editor"><X size={18} /></button>
          </header>
          <section className="design-lab-section">
            <details className="design-lab-disclosure">
              <summary><span>Corner radius</span><output>{values.radiusTL}px</output><ChevronDown size={18} aria-hidden="true" /></summary>
              <div className="design-lab-control-grid">
                <label className="design-lab-field"><span>Top left</span><input aria-label="Radius top left" type="number" min="0" max="48" value={values.radiusTL} onChange={(event) => update("radiusTL", clamp(event.target.value, 0, 48, values.radiusTL))} /></label>
                <label className="design-lab-field"><span>Top right</span><input aria-label="Radius top right" type="number" min="0" max="48" value={values.radiusTR} onChange={(event) => update("radiusTR", clamp(event.target.value, 0, 48, values.radiusTR))} /></label>
                <label className="design-lab-field"><span>Bottom right</span><input aria-label="Radius bottom right" type="number" min="0" max="48" value={values.radiusBR} onChange={(event) => update("radiusBR", clamp(event.target.value, 0, 48, values.radiusBR))} /></label>
                <label className="design-lab-field"><span>Bottom left</span><input aria-label="Radius bottom left" type="number" min="0" max="48" value={values.radiusBL} onChange={(event) => update("radiusBL", clamp(event.target.value, 0, 48, values.radiusBL))} /></label>
              </div>
            </details>
            <label className="design-lab-slider"><span>Section spacing <output>{values.gap}px</output></span><input aria-label="Section spacing" type="range" min="0" max="48" step="2" value={values.gap} onChange={(event) => update("gap", Number(event.target.value))} /></label>
          </section>
          <section className="design-lab-section"><h3>Fill</h3>
            <div className="design-lab-mode-tabs" role="tablist" aria-label="Background type">
              {(["color", "gradient", "image"] as BackgroundType[]).map((type) => <button key={type} type="button" role="tab" aria-selected={values.backgroundType === type} className={values.backgroundType === type ? "is-active" : ""} onClick={() => update("backgroundType", type)}>{type}</button>)}
            </div>
            {values.backgroundType !== "image" && <label className="design-lab-color-row"><span className="color-swatch" style={{ backgroundColor: values.background }} /><span>{values.backgroundType === "gradient" ? "Base color" : "Background"}</span><input aria-label="Background color" type="color" value={values.background} onChange={(event) => update("background", event.target.value)} /><ChevronDown size={16} /></label>}
            {values.backgroundType === "gradient" && <p className="design-lab-hint">Soft linear gradient preview. It is only active in this editing session.</p>}
            {values.backgroundType === "image" && <div className="design-lab-image-area">
              <label className="design-lab-image-upload" style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}>
                <input aria-label="Choose background image" type="file" accept="image/*" onChange={(event) => selectImage(event.target.files?.[0])} />
                {!imageUrl && <><ImagePlus size={20} /><span>Choose background image</span></>}
              </label>
              <div className="design-lab-image-meta"><span>{imageName || "No image selected"}</span>{imageUrl && <button type="button" onClick={clearImage}>Remove</button>}</div>
              <p className="design-lab-hint">Local image preview only. It is never uploaded or saved.</p>
            </div>}
          </section>
          <section className="design-lab-section"><h3>Stroke</h3>
            <label className="design-lab-color-row"><span className="color-swatch" style={{ backgroundColor: values.borderColor }} /><span>Border color</span><input aria-label="Border color" type="color" value={values.borderColor} onChange={(event) => update("borderColor", event.target.value)} /></label>
            <label className="design-lab-slider"><span>Weight <output>{values.border}px</output></span><input type="range" min="0" max="3" step="1" value={values.border} onChange={(event) => update("border", Number(event.target.value))} /></label>
          </section>
          <section className="design-lab-section"><h3>Shadow</h3>
            <label className="design-lab-check"><input type="checkbox" checked={values.shadowEnabled} onChange={(event) => update("shadowEnabled", event.target.checked)} />Enable panel shadow</label>
            {values.shadowEnabled && <>
              <label className="design-lab-select"><span>Style</span><select aria-label="Shadow style" value={values.shadowType} onChange={(event) => update("shadowType", event.target.value as ShadowType)}><option value="drop">Drop shadow</option><option value="inner">Inner shadow</option></select></label>
              <div className="design-lab-control-grid design-lab-shadow-grid">
                <label className="design-lab-field"><span>Position X</span><input aria-label="Shadow position X" type="number" min="-48" max="48" value={values.shadowX} onChange={(event) => update("shadowX", clamp(event.target.value, -48, 48, values.shadowX))} /></label>
                <label className="design-lab-field"><span>Position Y</span><input aria-label="Shadow position Y" type="number" min="-48" max="48" value={values.shadowY} onChange={(event) => update("shadowY", clamp(event.target.value, -48, 48, values.shadowY))} /></label>
                <label className="design-lab-field"><span>Blur</span><input aria-label="Shadow blur" type="number" min="0" max="80" value={values.shadowBlur} onChange={(event) => update("shadowBlur", clamp(event.target.value, 0, 80, values.shadowBlur))} /></label>
                <label className="design-lab-field"><span>Spread</span><input aria-label="Shadow spread" type="number" min="-40" max="40" value={values.shadowSpread} onChange={(event) => update("shadowSpread", clamp(event.target.value, -40, 40, values.shadowSpread))} /></label>
              </div>
              <label className="design-lab-color-row"><span className="color-swatch" style={{ backgroundColor: values.shadowColor }} /><span>Shadow color</span><input aria-label="Shadow color" type="color" value={values.shadowColor} onChange={(event) => update("shadowColor", event.target.value)} /></label>
              <label className="design-lab-slider"><span>Opacity <output>{values.shadowOpacity}%</output></span><input aria-label="Shadow opacity" type="range" min="0" max="100" step="1" value={values.shadowOpacity} onChange={(event) => update("shadowOpacity", Number(event.target.value))} /></label>
            </>}
          </section>
          <footer className="design-lab-panel-footer"><button type="button" onClick={reset}>Reset styles</button></footer>
        </aside>
      )}
      <button type="button" className="design-lab-trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open}><span aria-hidden="true">✦</span> Edit style</button>
    </div>
  );
}
