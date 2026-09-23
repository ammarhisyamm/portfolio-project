"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Eye, ImagePlus, SlidersHorizontal, X } from "lucide-react";

type BackgroundType = "color" | "gradient" | "image";

const defaults = {
  radiusTL: 12, radiusTR: 12, radiusBR: 12, radiusBL: 12, gap: 16, border: 1,
  borderColor: "#F4F4F4", background: "#f5f5f5", backgroundType: "color" as BackgroundType,
};
type StyleValues = typeof defaults;

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
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
            <label className="design-lab-color-row"><span className="color-swatch" style={{ backgroundColor: values.borderColor }} /><span>Border color</span><input aria-label="Border color" type="color" value={values.borderColor} onChange={(event) => update("borderColor", event.target.value)} /><X size={16} /></label>
            <label className="design-lab-slider"><span>Weight <output>{values.border}px</output></span><input type="range" min="0" max="3" step="1" value={values.border} onChange={(event) => update("border", Number(event.target.value))} /></label>
            <div className="design-lab-select"><span>Inside</span><ChevronDown size={16} /></div>
          </section>
          <footer className="design-lab-panel-footer"><button type="button" onClick={reset}>Reset styles</button></footer>
        </aside>
      )}
      <button type="button" className="design-lab-trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open}><span aria-hidden="true">✦</span> Edit style</button>
    </div>
  );
}
