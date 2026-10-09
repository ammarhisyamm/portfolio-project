import * as THREE from "three";

export function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 4) {
  const words = text.replace(/[\u2013\u2014]/g, "-").split(/\s+/);
  let line = "", lines = 0;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, y + lines * lineHeight);
      line = word;
      if (++lines >= maxLines - 1) break;
    } else line = next;
  }
  if (line) ctx.fillText(line, x, y + lines * lineHeight);
}

export function titleTexture(title: string, subtitle: string, description = "", number = "") {
  return canvasTexture(1024, 1024, ctx => {
    ctx.fillStyle = "#1c1813";
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.strokeStyle = "#806643";
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, 968, 968);
    ctx.fillStyle = "#c4a36d";
    ctx.font = "30px Georgia";
    ctx.fillText(number, 76, 110);
    ctx.fillStyle = "#f0e3cc";
    ctx.font = "72px Georgia";
    wrapText(ctx, title, 76, 250, 850, 85, 3);
    ctx.fillStyle = "#bfae91";
    ctx.font = "28px Arial";
    wrapText(ctx, subtitle, 76, 530, 850, 43, 2);
    ctx.fillStyle = "#d1c4af";
    ctx.font = "32px Arial";
    wrapText(ctx, description, 76, 650, 850, 49, 5);
  });
}

export function coverTexture(image: HTMLImageElement, title: string, subtitle: string, number: string) {
  return canvasTexture(1024, 1280, ctx => {
    ctx.fillStyle = "#171510";
    ctx.fillRect(0, 0, 1024, 1280);
    ctx.fillStyle = "#d1aa6d";
    ctx.font = "28px Georgia";
    ctx.fillText(number, 72, 91);
    ctx.font = "64px Georgia";
    ctx.fillStyle = "#f0e4ce";
    wrapText(ctx, title, 72, 181, 870, 68, 2);
    ctx.font = "25px Arial";
    ctx.fillStyle = "#bbab92";
    ctx.fillText(subtitle.slice(0, 65), 72, 292);
    const x = 58, y = 346, w = 908, h = 790;
    const scale = Math.max(w / image.width, h / image.height);
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.drawImage(image, x + (w - image.width * scale) / 2, y + (h - image.height * scale) / 2, image.width * scale, image.height * scale);
    ctx.restore();
    ctx.strokeStyle = "#806b47";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#ddcbaa";
    ctx.font = "25px Arial";
    ctx.fillText("View the collection", 72, 1211);
    ctx.fillText("↗", 918, 1211);
  });
}

export function haloTexture() {
  return canvasTexture(128, 128, ctx => {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,228,175,.7)");
    gradient.addColorStop(.22, "rgba(239,180,89,.15)");
    gradient.addColorStop(1, "rgba(211,145,64,0)");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  });
}

export function stoneTexture() {
  return canvasTexture(256, 256, ctx => {
    ctx.fillStyle = "#302a22"; ctx.fillRect(0, 0, 256, 256);
    // Seeded grain so rebuilding the scene preserves its material character.
    let seed = 23;
    for (let i = 0; i < 20000; i++) {
      seed = (seed * 16807) % 2147483647;
      const x = seed % 256;
      seed = (seed * 16807) % 2147483647;
      const shade = 35 + seed % 34;
      ctx.fillStyle = `rgba(${shade + 13},${shade + 5},${shade},.3)`;
      ctx.fillRect(x, seed % 256, 1, 1);
    }
  });
}

export function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    if (!src) { resolve(null); return; }
    const image = new Image();
    image.crossOrigin = "anonymous";
    const timer = window.setTimeout(() => { image.src = ""; resolve(null); }, 12000);
    image.onload = () => { clearTimeout(timer); resolve(image); };
    image.onerror = () => { clearTimeout(timer); resolve(null); };
    image.src = src;
  });
}
