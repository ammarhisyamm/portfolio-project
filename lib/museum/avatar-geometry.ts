import * as THREE from "three";

const bell = (v: number, center: number, width: number) => Math.exp(-(((v - center) / width) ** 2));

export function faceDepth(x: number, y: number) {
  const uy = y / .193, jaw = uy < -.12 ? 1 - .26 * Math.pow((-uy - .12) / .88, 1.15) : 1;
  const uz = Math.sqrt(Math.max(0, 1 - (x / (.151 * jaw)) ** 2 - uy ** 2));
  let detail = 0;
  for (const s of [-1, 1]) {
    detail += .014 * bell(x, s * .085, .048) * bell(y, -.026, .045);
    detail -= .014 * bell(x, s * .061, .032) * bell(y, .035, .019);
    detail += .009 * bell(x, s * .062, .045) * bell(y, .068, .018);
    detail -= .008 * bell(x, s * .09, .03) * bell(y, -.078, .034);
  }
  detail += .021 * bell(x, 0, .017) * bell(y, .012, .05);
  detail += .051 * bell(x, 0, .023) * bell(y, -.022, .018);
  detail += .02 * (bell(x, -.023, .014) + bell(x, .023, .014)) * bell(y, -.031, .014);
  detail -= .011 * bell(x, 0, .026) * bell(y, -.043, .009);
  detail += .018 * bell(x, 0, .051) * bell(y, -.088, .026);
  detail -= .007 * bell(x, 0, .039) * bell(y, -.116, .013);
  detail += .026 * bell(x, 0, .045) * bell(y, -.145, .028);
  return uz * .143 + detail * THREE.MathUtils.smoothstep(uz, .15, .72);
}

/** A single sculpted surface: features displace the face, rather than being
 * separate skin-coloured spheres. The mesh remains lit correctly from any view. */
export function sculptedFace() {
  const geometry = new THREE.SphereGeometry(1, 64, 48);
  const positions = geometry.getAttribute("position");
  const colors: number[] = [];
  const base = new THREE.Color("#bb9279"), cheek = new THREE.Color("#b78070");
  for (let i = 0; i < positions.count; i++) {
    const ux = positions.getX(i), uy = positions.getY(i), uz = positions.getZ(i);
    const jaw = uy < -.12 ? 1 - .26 * Math.pow((-uy - .12) / .88, 1.15) : 1;
    const x = ux * .151 * jaw, y = uy * .193;
    let z = uz * .143;
    if (uz > 0) z = faceDepth(x, y);
    positions.setXYZ(i, x, y, z);
    const redness = uz > 0 ? .38 * bell(Math.abs(x), .09, .04) * bell(y, -.035, .035) : 0;
    const color = base.clone().lerp(cheek, redness);
    if (uz > 0) color.lerp(new THREE.Color("#966d63"), .6 * bell(x, 0, .036) * bell(y, -.085, .006));
    const grain = Math.sin(i * 12.9898) * .012;
    color.multiplyScalar(1 + grain);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** Tapered elliptical locks, not cylindrical tubes. Fluted cross-sections make
 * highlights follow the strand flow while preserving a continuous silhouette. */
export function hairLock(points: number[][], width: number, thickness: number, seed = 0) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const length = 18, sides = 8;
  const frames = curve.computeFrenetFrames(length, false);
  const positions: number[] = [], uv: number[] = [], indices: number[] = [];
  for (let row = 0; row <= length; row++) {
    const t = row / length, center = curve.getPointAt(t);
    const taper = .11 + .89 * Math.pow(Math.sin(Math.PI * t), .55);
    for (let col = 0; col <= sides; col++) {
      const a = col / sides * Math.PI * 2;
      const flute = 1 + .11 * Math.sin(a * 5 + seed);
      const p = center.clone()
        .addScaledVector(frames.normals[row], Math.cos(a) * width * taper * flute)
        .addScaledVector(frames.binormals[row], Math.sin(a) * thickness * taper * flute);
      positions.push(p.x, p.y, p.z); uv.push(col / sides, t);
      if (row < length && col < sides) {
        const k = row * (sides + 1) + col;
        indices.push(k, k + 1, k + sides + 1, k + 1, k + sides + 2, k + sides + 1);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(indices); g.computeVertexNormals(); return g;
}

export function sculptedHairBase() {
  const rings = 24, sides = 64, positions: number[] = [], uv: number[] = [], indices: number[] = [];
  for (let row = 0; row <= rings; row++) for (let col = 0; col <= sides; col++) {
    const a = col / sides * Math.PI * 2, front = (Math.cos(a) + 1) / 2;
    const line = -.07 + .186 * front ** 2 + .009 * Math.sin(a * 7);
    const phi = row / rings * Math.acos(line / .204), wave = .002 * Math.sin(a * 18 + phi * 5);
    positions.push((.159 + wave) * Math.sin(phi) * Math.sin(a), .204 * Math.cos(phi) + .017 * front * Math.sin(phi), (.151 + wave) * Math.sin(phi) * Math.cos(a) - .009);
    uv.push(col / sides, row / rings);
    if (row < rings && col < sides) { const k = row * (sides + 1) + col; indices.push(k, k + sides + 1, k + 1, k + 1, k + sides + 1, k + sides + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(indices); g.computeVertexNormals(); return g;
}

/** Continuous sleeve / trouser surface with four-ring blend around the joint.
 * Two bones deform the same vertices: no disconnected elbow or knee balls. */
export function tailoredLimb(length: number, joint: number, radii: number[], flatten = 1, side = 1) {
  const rings = 32, sides = 20;
  const positions: number[] = [], uv: number[] = [], indices: number[] = [], bones: number[] = [], weights: number[] = [];
  for (let row = 0; row <= rings; row++) {
    const t = row / rings, y = .024 - t * (length + .024);
    const f = t * (radii.length - 1), left = Math.min(radii.length - 2, Math.floor(f));
    const radius = THREE.MathUtils.lerp(radii[left], radii[left + 1], f - left);
    const bend = THREE.MathUtils.smoothstep(-y, joint - .07, joint + .07);
    for (let col = 0; col <= sides; col++) {
      const a = col / sides * Math.PI * 2;
      const crease = 1 + .028 * Math.sin(t * 43 + Math.cos(a) * 3) * Math.pow(Math.sin(Math.PI * t), 2);
      positions.push(Math.cos(a) * radius * crease + side * .012 * t, y, Math.sin(a) * radius * flatten * crease);
      uv.push(col / sides, t * 2);
      bones.push(0, bend > 0 ? 1 : 0, 0, 0); weights.push(1 - bend, bend, 0, 0);
      if (row < rings && col < sides) {
        const k = row * (sides + 1) + col;
        indices.push(k, k + 1, k + sides + 1, k + 1, k + sides + 2, k + sides + 1);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(bones, 4));
  g.setAttribute("skinWeight", new THREE.Float32BufferAttribute(weights, 4));
  g.setIndex(indices); g.computeVertexNormals(); return g;
}
