import * as THREE from "three";

/** The storybook palette: cream plaster, royal purple and blue, gold trim, red velvet. */
export const PALETTE = {
  cream: "#fbefdc", plaster: "#f4e3c8", royal: "#4c46bd", royalDeep: "#2f2a86", sky: "#7fd0ff",
  gold: "#f2b632", goldDeep: "#c4831a", red: "#cc3b3d", redDeep: "#93242f", purple: "#6c42c7", purpleDeep: "#48288f",
  green: "#3f9a5e", leaf: "#5cc456", wood: "#c97a3e", woodDeep: "#8a4a26", ink: "#3a2268", inkSoft: "#8a6a3a",
};

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

/** A cream card in a gilded border, the kind of label that sits beside a painting. */
function card(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = PALETTE.goldDeep; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = PALETTE.gold; ctx.fillRect(10, 10, width - 20, height - 20);
  ctx.fillStyle = PALETTE.cream; ctx.beginPath(); ctx.roundRect(30, 30, width - 60, height - 60, 22); ctx.fill();
  ctx.strokeStyle = "rgba(196,131,26,.55)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(46, 46, width - 92, height - 92, 16); ctx.stroke();
}

export function titleTexture(title: string, subtitle: string, description = "", number = "") {
  return canvasTexture(1024, 1024, ctx => {
    card(ctx, 1024, 1024);
    if (number) {
      ctx.fillStyle = PALETTE.purple; ctx.beginPath(); ctx.arc(126, 128, 46, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff6e2"; ctx.font = "bold 34px Arial"; ctx.textAlign = "center"; ctx.fillText(number, 126, 140); ctx.textAlign = "left";
    }
    ctx.fillStyle = PALETTE.ink;
    ctx.font = "bold 74px Georgia";
    wrapText(ctx, title, 86, 290, 850, 86, 3);
    ctx.fillStyle = PALETTE.red;
    ctx.font = "bold 30px Arial";
    wrapText(ctx, subtitle, 86, 560, 850, 42, 2);
    ctx.fillStyle = "#5b4a3a";
    ctx.font = "32px Arial";
    wrapText(ctx, description, 86, 670, 850, 48, 5);
  });
}

export function coverTexture(image: HTMLImageElement, title: string, subtitle: string, number: string, footer = "View the collection") {
  return canvasTexture(1024, 1280, ctx => {
    card(ctx, 1024, 1280);
    ctx.fillStyle = PALETTE.purple; ctx.beginPath(); ctx.roundRect(72, 72, 96, 52, 26); ctx.fill();
    ctx.fillStyle = "#fff6e2"; ctx.font = "bold 28px Arial"; ctx.textAlign = "center"; ctx.fillText(number, 120, 108); ctx.textAlign = "left";
    ctx.font = "bold 62px Georgia";
    ctx.fillStyle = PALETTE.ink;
    wrapText(ctx, title, 72, 194, 870, 68, 2);
    ctx.font = "bold 25px Arial";
    ctx.fillStyle = PALETTE.red;
    ctx.fillText(subtitle.slice(0, 65), 72, 300);
    const x = 72, y = 346, w = 880, h = 780;
    const scale = Math.max(w / image.width, h / image.height);
    ctx.save();
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 18); ctx.clip();
    ctx.drawImage(image, x + (w - image.width * scale) / 2, y + (h - image.height * scale) / 2, image.width * scale, image.height * scale);
    ctx.restore();
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 18); ctx.stroke();
    ctx.fillStyle = PALETTE.purple; ctx.beginPath(); ctx.roundRect(72, 1160, 880, 64, 32); ctx.fill();
    ctx.fillStyle = "#fff6e2";
    ctx.font = "bold 26px Arial";
    ctx.fillText(footer, 108, 1201);
    ctx.fillText("↗", 900, 1201);
  });
}

/** The contact kiosk: a glowing touch screen showing an empty message form. */
export function kioskTexture(title: string, subtitle: string) {
  return canvasTexture(1024, 786, ctx => {
    const g = ctx.createLinearGradient(0, 0, 0, 786); g.addColorStop(0, PALETTE.purple); g.addColorStop(1, PALETTE.purpleDeep);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 786);
    ctx.strokeStyle = PALETTE.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(20, 20, 984, 746, 30); ctx.stroke();
    ctx.fillStyle = "#fff6e2"; ctx.font = "bold 64px Georgia"; ctx.fillText(title, 72, 128);
    ctx.fillStyle = "#ffd98a"; ctx.font = "bold 28px Arial"; ctx.fillText(subtitle.slice(0, 48), 72, 178);
    const field = (label: string, x: number, y: number, w: number, h: number) => {
      ctx.fillStyle = "#e4d6ff"; ctx.font = "bold 22px Arial"; ctx.fillText(label.toUpperCase(), x, y - 14);
      ctx.fillStyle = "#fff6e2"; ctx.strokeStyle = PALETTE.gold; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 12); ctx.fill(); ctx.stroke();
    };
    field("Name", 72, 262, 420, 70); field("Email", 532, 262, 420, 70); field("Message", 72, 410, 880, 170);
    ctx.fillStyle = PALETTE.gold; ctx.beginPath(); ctx.roundRect(72, 628, 260, 76, 38); ctx.fill();
    ctx.fillStyle = PALETTE.ink; ctx.font = "bold 28px Arial"; ctx.textAlign = "center"; ctx.fillText("Send  →", 202, 676);
    ctx.textAlign = "right"; ctx.fillStyle = "#fff6e2"; ctx.font = "26px Arial"; ctx.fillText("Tap the screen to write", 952, 676);
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

/** Cream tiles with red eight-pointed stars at the corners and thin gold joints. */
export function starTileTexture() {
  return canvasTexture(512, 512, ctx => {
    ctx.fillStyle = PALETTE.cream; ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = "#f6dfbd"; ctx.fillRect(0, 0, 256, 256); ctx.fillRect(256, 256, 256, 256);
    ctx.strokeStyle = "#e2bf86"; ctx.lineWidth = 4;
    for (const v of [0, 256, 512]) { ctx.beginPath(); ctx.moveTo(v, 0); ctx.lineTo(v, 512); ctx.moveTo(0, v); ctx.lineTo(512, v); ctx.stroke(); }
    const star = (x: number, y: number, outer: number, inner: number, color: string) => {
      ctx.fillStyle = color; ctx.beginPath();
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = i % 2 ? inner : outer; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
      ctx.closePath(); ctx.fill();
    };
    for (const x of [0, 256, 512]) for (const y of [0, 256, 512]) { star(x, y, 74, 44, PALETTE.red); star(x, y, 30, 17, PALETTE.gold); }
    for (const [x, y] of [[128, 128], [384, 128], [128, 384], [384, 384]]) {
      ctx.fillStyle = "#efcf9e"; ctx.beginPath(); ctx.moveTo(x, y - 34); ctx.lineTo(x + 34, y); ctx.lineTo(x, y + 34); ctx.lineTo(x - 34, y); ctx.closePath(); ctx.fill();
    }
  });
}

/** A red velvet runner with a gold border, tiled along its length. */
export function carpetTexture() {
  return canvasTexture(256, 512, ctx => {
    ctx.fillStyle = PALETTE.red; ctx.fillRect(0, 0, 256, 512);
    ctx.fillStyle = PALETTE.gold; ctx.fillRect(0, 0, 20, 512); ctx.fillRect(236, 0, 20, 512);
    ctx.fillStyle = PALETTE.redDeep; ctx.fillRect(26, 0, 8, 512); ctx.fillRect(222, 0, 8, 512);
    ctx.fillStyle = "rgba(255,190,90,.28)";
    for (const y of [128, 384]) { ctx.beginPath(); ctx.moveTo(128, y - 46); ctx.lineTo(170, y); ctx.lineTo(128, y + 46); ctx.lineTo(86, y); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = "rgba(120,20,30,.35)";
    for (let y = 0; y < 512; y += 16) for (let x = 44; x < 214; x += 16) ctx.fillRect(x + (y % 32 ? 8 : 0), y, 2, 2);
  });
}

/** A round purple rug with a gold rim and a damask ring. */
export function roundRugTexture(main: string = PALETTE.purple, deep: string = PALETTE.purpleDeep) {
  return canvasTexture(512, 512, ctx => {
    ctx.fillStyle = PALETTE.gold; ctx.beginPath(); ctx.arc(256, 256, 254, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = main; ctx.beginPath(); ctx.arc(256, 256, 232, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = deep; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(256, 256, 196, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.12)";
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; ctx.beginPath(); ctx.ellipse(256 + Math.cos(a) * 160, 256 + Math.sin(a) * 160, 16, 8, a, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = "rgba(242,182,50,.5)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(256, 256, 120, 0, Math.PI * 2); ctx.stroke();
  });
}

/** A bright sky with soft clouds, seen through the windows. */
export function skyTexture(width = 512, height = 1024) {
  return canvasTexture(width, height, ctx => {
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, "#5fb8ff"); g.addColorStop(.6, "#a8e0ff"); g.addColorStop(1, "#e9f7ff");
    ctx.fillStyle = g; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,.92)";
    for (const [x, y, r] of [[.25, .62, .16], [.42, .58, .12], [.6, .64, .15], [.78, .3, .1], [.66, .28, .08], [.15, .26, .07]]) {
      for (const dx of [-1, 0, 1]) { ctx.beginPath(); ctx.arc((x + dx * r * .7) * width, y * height - (dx ? 0 : r * width * .25), r * width * (dx ? .55 : .7), 0, Math.PI * 2); ctx.fill(); }
    }
  });
}

/**
 * Striped wallpaper with small gold studs, drawn from world position so every
 * wall, long or short, gets the same stripe width.
 */
export function wallpaper(material: THREE.MeshStandardMaterial, gold = "vec3(.98, .74, .22)") {
  material.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vPaperPos;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvPaperPos = (modelMatrix * vec4(transformed, 1.)).xyz;");
    shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vPaperPos;")
      .replace("#include <color_fragment>", `#include <color_fragment>
        float along = (vPaperPos.x + vPaperPos.z) / .9;
        diffuseColor.rgb *= mix(1., .86, step(.5, fract(along)));
        vec2 cell = vec2(along, vPaperPos.y / .9 + .5 * floor(along));
        float stud = 1. - smoothstep(.06, .09, length(fract(cell) - .5));
        diffuseColor.rgb = mix(diffuseColor.rgb, ${gold}, stud * .85);`);
  };
}

/** Small painted canvases for the gilded frames on the end walls. */
export function paintingTexture(kind: "field" | "sunflowers" | "cat" | "stars") {
  return canvasTexture(384, 480, ctx => {
    const strokes = (count: number, colors: string[], y0: number, y1: number, length: number, seed: number) => {
      ctx.lineCap = "round"; ctx.lineWidth = 9;
      for (let i = 0; i < count; i++) {
        seed = (seed * 16807) % 2147483647; const x = seed % 384; seed = (seed * 16807) % 2147483647; const y = y0 + seed % (y1 - y0);
        ctx.strokeStyle = colors[i % colors.length]; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + length / 2, y - 10, x + length, y); ctx.stroke();
      }
    };
    if (kind === "field" || kind === "stars") {
      const night = kind === "stars";
      ctx.fillStyle = night ? "#22307a" : "#8fc7e8"; ctx.fillRect(0, 0, 384, 480);
      strokes(140, night ? ["#3a4fb0", "#5468c9", "#2a3a8f"] : ["#cfe8f6", "#a6d3ee", "#e8f4fb"], 0, 300, 46, 5);
      if (night) for (const [x, y, r] of [[80, 90, 22], [250, 60, 16], [320, 170, 26], [150, 200, 14]]) {
        ctx.fillStyle = "rgba(255,226,120,.35)"; ctx.beginPath(); ctx.arc(x, y, r * 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ffe27a"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = night ? "#1b4a3a" : "#e5b23a"; ctx.fillRect(0, 300, 384, 180);
      strokes(120, night ? ["#2a6a50", "#163a2c"] : ["#f2c94c", "#d9982a", "#f7dc7a"], 300, 480, 30, 9);
      ctx.fillStyle = night ? "#10261d" : "#2f6b3a"; ctx.beginPath(); ctx.moveTo(276, 470); ctx.quadraticCurveTo(300, 200, 312, 110); ctx.quadraticCurveTo(326, 200, 348, 470); ctx.closePath(); ctx.fill();
    } else if (kind === "sunflowers") {
      ctx.fillStyle = "#f3d58c"; ctx.fillRect(0, 0, 384, 480);
      strokes(90, ["#f7e2a8", "#e9c46a"], 0, 330, 40, 13);
      ctx.fillStyle = "#3f8a52"; for (const [x, y] of [[120, 160], [200, 110], [270, 180], [170, 220]]) { ctx.fillRect(x - 3, y, 6, 360 - y); }
      for (const [x, y, r] of [[120, 160, 44], [200, 110, 50], [270, 180, 42], [170, 220, 38]]) {
        ctx.fillStyle = "#f6b417"; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72, r * .42, r * .16, a, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = "#7a4a1c"; ctx.beginPath(); ctx.arc(x, y, r * .42, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = "#4a7fc2"; ctx.beginPath(); ctx.moveTo(130, 330); ctx.lineTo(254, 330); ctx.quadraticCurveTo(270, 460, 192, 466); ctx.quadraticCurveTo(114, 460, 130, 330); ctx.fill();
      ctx.fillStyle = "#c97a3e"; ctx.fillRect(0, 440, 384, 40);
    } else {
      ctx.fillStyle = "#c9e6c2"; ctx.fillRect(0, 0, 384, 480);
      strokes(60, ["#b4d9ac", "#dcefd6"], 0, 480, 40, 21);
      ctx.fillStyle = "#e48a3a"; ctx.beginPath(); ctx.ellipse(192, 400, 130, 110, 0, Math.PI, 0); ctx.fill();
      ctx.beginPath(); ctx.arc(192, 250, 100, 0, Math.PI * 2); ctx.fill();
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(192 + s * 90, 200); ctx.lineTo(192 + s * 78, 120); ctx.lineTo(192 + s * 30, 168); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = "#fff4e6"; ctx.beginPath(); ctx.ellipse(192, 290, 52, 38, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2a2340"; for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(192 + s * 40, 236, 13, 18, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = "#e8708a"; ctx.beginPath(); ctx.moveTo(180, 270); ctx.lineTo(204, 270); ctx.lineTo(192, 284); ctx.closePath(); ctx.fill();
      ctx.fillStyle = PALETTE.gold; ctx.beginPath(); ctx.moveTo(140, 158); ctx.lineTo(156, 120); ctx.lineTo(176, 146); ctx.lineTo(192, 112); ctx.lineTo(208, 146); ctx.lineTo(228, 120); ctx.lineTo(244, 158); ctx.closePath(); ctx.fill();
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
