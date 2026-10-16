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

export function coverTexture(image: HTMLImageElement, title: string, subtitle: string, number: string, footer = "View the collection") {
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
    ctx.fillText(footer, 72, 1211);
    ctx.fillText("↗", 918, 1211);
  });
}

/** The contact kiosk: a glowing touch screen showing an empty message form. */
export function kioskTexture(title: string, subtitle: string) {
  return canvasTexture(1024, 786, ctx => {
    const g = ctx.createLinearGradient(0, 0, 0, 786); g.addColorStop(0, "#1f2a2c"); g.addColorStop(1, "#121718");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 786);
    ctx.strokeStyle = "#8fb3ad"; ctx.globalAlpha = .55; ctx.lineWidth = 2; ctx.strokeRect(24, 24, 976, 738); ctx.globalAlpha = 1;
    ctx.fillStyle = "#f2e6cf"; ctx.font = "64px Georgia"; ctx.fillText(title, 72, 128);
    ctx.fillStyle = "#a9c3bd"; ctx.font = "28px Arial"; ctx.fillText(subtitle.slice(0, 48), 72, 178);
    const field = (label: string, x: number, y: number, w: number, h: number) => {
      ctx.fillStyle = "#8fa9a4"; ctx.font = "22px Arial"; ctx.fillText(label.toUpperCase(), x, y - 14);
      ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.strokeStyle = "rgba(190,220,214,.45)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 12); ctx.fill(); ctx.stroke();
    };
    field("Name", 72, 262, 420, 70); field("Email", 532, 262, 420, 70); field("Message", 72, 410, 880, 170);
    ctx.fillStyle = "#e8c48a"; ctx.beginPath(); ctx.roundRect(72, 628, 260, 76, 38); ctx.fill();
    ctx.fillStyle = "#1c1611"; ctx.font = "bold 28px Arial"; ctx.textAlign = "center"; ctx.fillText("Send  →", 202, 676);
    ctx.textAlign = "right"; ctx.fillStyle = "#cfe3de"; ctx.font = "26px Arial"; ctx.fillText("Tap the screen to write", 952, 676);
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
