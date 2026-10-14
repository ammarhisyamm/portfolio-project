import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { canvasTexture, haloTexture } from "./materials";

// Head shape in its own space (front is +z): a stylized oval with a narrower
// jaw, soft cheeks, a small nose and a rounded chin, like the character sheet.
const SKULL = new THREE.Vector3(.114, .143, .128);
const smooth = THREE.MathUtils.smoothstep;
function headRadius(d: THREE.Vector3) {
  const ellipsoid = 1 / Math.sqrt((d.x / SKULL.x) ** 2 + (d.y / SKULL.y) ** 2 + (d.z / SKULL.z) ** 2);
  const front = Math.max(0, d.z), low = smooth(-d.y, 0, .95);
  const jaw = 1 - .13 * low * Math.abs(d.x) ** 1.3 - .16 * low * Math.max(0, -d.z);
  const cheek = 1 + .06 * Math.exp(-(((Math.abs(d.x) - .55) / .22) ** 2 + ((d.y + .3) / .2) ** 2)) * front;
  const chin = 1 + .05 * Math.exp(-((d.x / .22) ** 2 + ((d.y + .78) / .16) ** 2)) * front;
  const nose = 1 + .13 * Math.exp(-((d.x / .08) ** 2 + ((d.y + .24) / .12) ** 2)) * front ** 4;
  const brow = 1 + .025 * Math.exp(-(((d.y - .2) / .1) ** 2)) * front * (1 - Math.abs(d.x));
  return ellipsoid * jaw * cheek * chin * nose * brow;
}
const surface = (x: number, y: number, z: number, out = 0) => { const d = new THREE.Vector3(x, y, z).normalize(); return d.multiplyScalar(headRadius(d) + out); };
function surfaceFrame(x: number, y: number, z: number, forward = .4) {
  const p = surface(x, y, z), e = .01;
  const u = surface(x + e, y, z).sub(surface(x - e, y, z)), v = surface(x, y + e, z).sub(surface(x, y - e, z));
  const normal = new THREE.Vector3().crossVectors(u, v).normalize();
  if (normal.z < 0) normal.negate();
  normal.lerp(new THREE.Vector3(0, 0, 1), forward).normalize();
  return { position: p, quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal) };
}

// Where the hair stops on the scalp, by angle around the head (0 = front):
// a forehead hairline, short sideburns, clear ears and a tapered nape.
const HAIRLINE: [number, number][] = [[0, .5], [.6, .44], [1.1, .22], [1.33, -.18], [1.5, .1], [1.85, .24], [2.15, -.1], [2.55, -.48], [Math.PI, -.6]];
function hairline(d: THREE.Vector3) {
  const a = Math.abs(Math.atan2(d.x, d.z));
  for (let i = 1; i < HAIRLINE.length; i++) {
    const [a0, y0] = HAIRLINE[i - 1], [a1, y1] = HAIRLINE[i];
    if (a <= a1) return THREE.MathUtils.lerp(y0, y1, (a - a0) / (a1 - a0));
  }
  return -.6;
}

function eyeTexture() {
  // Equirect map for a unit sphere: the front (+z) sits at u = .25, v = .5.
  return canvasTexture(512, 256, ctx => {
    ctx.fillStyle = "#f6f1ea"; ctx.fillRect(0, 0, 512, 256);
    const x = 128, y = 128;
    const iris = ctx.createRadialGradient(x, y - 6, 6, x, y, 52);
    iris.addColorStop(0, "#8a5530"); iris.addColorStop(.5, "#5c341c"); iris.addColorStop(.86, "#33190c"); iris.addColorStop(1, "#160a05");
    ctx.fillStyle = iris; ctx.beginPath(); ctx.arc(x, y, 52, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#090403"; ctx.beginPath(); ctx.arc(x, y, 23, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,200,150,.28)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y + 4, 37, .4, 2.7); ctx.stroke();
  });
}

/** Hisyam as a stylized 3D character, after the character sheet: side-swept
 * wavy black hair, round wire glasses, warm brown eyes and a small smile; a
 * black knit over a white tee, charcoal cargo trousers with rolled cuffs, grey
 * runners and a dark leather backpack with a gold "h". Every limb hangs off a
 * named bone so the portable clips still apply. */
export function createMuseumAvatar(knitMap?: THREE.Texture) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  root.name = "Hisyam"; body.name = "Body";
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(.9, .66), new THREE.MeshBasicMaterial({ map: haloTexture(), color: "#100c07", transparent: true, opacity: .36, depthWrite: false, toneMapped: false }));
  contact.rotation.x = -Math.PI / 2; contact.position.set(0, .028, .02); root.add(contact);
  if (knitMap) { knitMap.colorSpace = THREE.NoColorSpace; knitMap.wrapS = knitMap.wrapT = THREE.RepeatWrapping; knitMap.repeat.set(3, 3); }
  const knit = new THREE.MeshStandardMaterial({ color: "#1f1d1c", roughness: .95, bumpMap: knitMap ?? null, bumpScale: .005 });
  const rib = new THREE.MeshStandardMaterial({ color: "#171615", roughness: .95 });
  const trousers = new THREE.MeshStandardMaterial({ color: "#2e2b28", roughness: .88 });
  const seam = new THREE.MeshStandardMaterial({ color: "#211f1c", roughness: .9 });
  const tee = new THREE.MeshStandardMaterial({ color: "#f2efe9", roughness: .85, side: THREE.DoubleSide });
  const skin = new THREE.MeshPhysicalMaterial({ color: "#e6b28c", roughness: .55, sheen: .35, sheenColor: "#ffd2b8", sheenRoughness: .6 });
  const blush = new THREE.MeshStandardMaterial({ color: "#e08f7a", roughness: .8, transparent: true, opacity: .2, depthWrite: false });
  const hair = new THREE.MeshStandardMaterial({ color: "#16100d", roughness: .64 });
  const hairLight = new THREE.MeshStandardMaterial({ color: "#211712", roughness: .58 });
  const brows = new THREE.MeshStandardMaterial({ color: "#1c1410", roughness: .7 });
  const lash = new THREE.MeshStandardMaterial({ color: "#120c09", roughness: .5 });
  const eyeball = new THREE.MeshPhysicalMaterial({ map: eyeTexture(), roughness: .18, clearcoat: 1, clearcoatRoughness: .05 });
  const glint = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const lip = new THREE.MeshStandardMaterial({ color: "#a8644f", roughness: .6 });
  const frame = new THREE.MeshStandardMaterial({ color: "#2b2826", metalness: .75, roughness: .28 });
  const leather = new THREE.MeshStandardMaterial({ color: "#4a2e1d", roughness: .48 });
  const darkLeather = new THREE.MeshStandardMaterial({ color: "#33200f", roughness: .52 });
  const brass = new THREE.MeshStandardMaterial({ color: "#c8973f", metalness: .9, roughness: .28 });
  const upper = new THREE.MeshStandardMaterial({ color: "#e9e7e2", roughness: .8 });
  const suede = new THREE.MeshStandardMaterial({ color: "#b5b1aa", roughness: .95 });
  const sole = new THREE.MeshStandardMaterial({ color: "#f4f2ed", roughness: .85 });
  const outsole = new THREE.MeshStandardMaterial({ color: "#3d3a37", roughness: .95 });
  const nLogo = canvasTexture(128, 128, ctx => {
    ctx.translate(64, 64); ctx.transform(1, 0, -.28, 1, 0, 0);
    ctx.font = "bold 104px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#3a3d44"; ctx.fillText("N", 0, 4);
  });
  const logo = new THREE.MeshStandardMaterial({ map: nLogo, transparent: true, roughness: .8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  type XYZ = [number, number, number];
  function mesh(g: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, pos: XYZ, scale?: XYZ) {
    const m = new THREE.Mesh(g, material); m.position.set(...pos); if (scale) m.scale.set(...scale);
    m.castShadow = m.receiveShadow = true; parent.add(m); return m;
  }
  const sphere = (p: THREE.Object3D, m: THREE.Material, pos: XYZ, s: XYZ) => mesh(new THREE.SphereGeometry(1, 24, 16), m, p, pos, s);
  const box = (p: THREE.Object3D, m: THREE.Material, pos: XYZ, s: XYZ, radius = .02) => mesh(new RoundedBoxGeometry(...s, 3, radius), m, p, pos);
  const capsule = (p: THREE.Object3D, m: THREE.Material, pos: XYZ, radius: number, length: number) => mesh(new THREE.CapsuleGeometry(radius, length, 6, 18), m, p, pos);
  function tube(p: THREE.Object3D, m: THREE.Material, points: (XYZ | THREE.Vector3)[], radius: number, flatten = 1) {
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(v => v instanceof THREE.Vector3 ? v : new THREE.Vector3(...v))), 24, radius, 8);
    if (flatten !== 1) { const c = new THREE.Vector3(); g.computeBoundingBox(); g.boundingBox!.getCenter(c); g.translate(-c.x, -c.y, -c.z); g.scale(1, 1, flatten); g.translate(c.x, c.y, c.z); }
    return mesh(g, m, p, [0, 0, 0]);
  }
  const lathe = (p: THREE.Object3D, m: THREE.Material, profile: [number, number][], depth: number) => mesh(new THREE.LatheGeometry(new THREE.SplineCurve(profile.map(([r, y]) => new THREE.Vector2(r, y))).getPoints(32), 40), m, p, [0, 0, 0], [1, 1, depth]);

  // Torso: a relaxed crew-neck knit with the white tee at the collar and hem.
  lathe(body, knit, [[.19, .9], [.205, .93], [.211, 1.05], [.216, 1.22], [.214, 1.32], [.2, 1.39], [.15, 1.43], [.08, 1.452], [0, 1.46]], .68);
  mesh(new THREE.TorusGeometry(.198, .024, 10, 40), rib, body, [0, .915, 0], [1, .68, 1]).rotation.x = Math.PI / 2;
  mesh(new THREE.CylinderGeometry(.2, .198, .046, 40, 1, true), tee, body, [0, .876, 0], [1, 1, .71]);
  lathe(body, trousers, [[0, .79], [.13, .795], [.18, .82], [.192, .86], [.194, .9]], .72);
  mesh(new THREE.CylinderGeometry(.048, .054, .16, 20), skin, body, [0, 1.5, .004]);
  mesh(new THREE.TorusGeometry(.07, .019, 10, 32), rib, body, [0, 1.448, .004], [1, .8, 1]).rotation.x = Math.PI / 2;
  mesh(new THREE.TorusGeometry(.054, .01, 8, 32), tee, body, [0, 1.46, .006], [1, .82, 1]).rotation.x = Math.PI / 2;

  // Head: sculpted oval with a nose bridge, rounded chin and real ears. It is
  // drawn a little larger than life, the way the character sheet does it.
  const head = new THREE.Group(); head.name = "Head"; head.position.set(0, 1.675, .012); head.scale.setScalar(1.28); body.add(head);
  const skull = new THREE.SphereGeometry(1, 64, 48), sp = skull.getAttribute("position"), d = new THREE.Vector3();
  for (let i = 0; i < sp.count; i++) { d.set(sp.getX(i), sp.getY(i), sp.getZ(i)).normalize(); const r = headRadius(d); sp.setXYZ(i, d.x * r, d.y * r, d.z * r); }
  skull.computeVertexNormals();
  mesh(skull, skin, head, [0, 0, 0]);
  const blinkers: THREE.Group[] = [], OPEN = -.54, SHUT = 1.5;
  for (const s of [-1, 1]) {
    // Ears with a darker hollow.
    const ear = new THREE.Group(); ear.position.copy(surface(s, -.08, -.08, -.004)); ear.rotation.set(0, s * .45, s * -.08); head.add(ear);
    sphere(ear, skin, [0, 0, 0], [.012, .033, .022]);
    sphere(ear, lip, [s * .005, -.002, .004], [.006, .02, .012]).material = skin;
    // Eyes: big glossy brown irises under a soft upper lid with a dark lash line.
    const eyeFrame = surfaceFrame(s * .37, -.02, .93);
    const socket = new THREE.Group(); socket.position.copy(eyeFrame.position); socket.quaternion.copy(eyeFrame.quaternion); head.add(socket);
    const ball = mesh(new THREE.SphereGeometry(1, 28, 20), eyeball, socket, [0, 0, -.012], [.028, .028, .028]);
    ball.rotation.y = -s * .05;
    const shine = mesh(new THREE.CircleGeometry(1, 16), glint, socket, [.009, .008, .0124], [.0058, .0058, 1]); shine.castShadow = false;
    shine.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(.009, .008, .0244).normalize()));
    const lid = new THREE.Group(); lid.position.set(0, 0, -.012); socket.add(lid); blinkers.push(lid);
    mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), skin, lid, [0, 0, 0], [.0298, .0298, .0298]);
    // The lash line rides the lid's edge, thicker at the outer corner.
    tube(lid, lash, Array.from({ length: 9 }, (_, i) => { const a = -1.35 + i / 8 * 2.7; return new THREE.Vector3(Math.sin(a) * .0305, (s * a > .9 ? .0025 : 0), Math.cos(a) * .0305); }), .0026);
    lid.rotation.x = OPEN;
    // A soft lower lid line.
    tube(socket, blush, Array.from({ length: 5 }, (_, i) => { const a = -1 + i / 4 * 2; return new THREE.Vector3(Math.sin(a) * .025, -.019 - Math.cos(a) * .002, -.012 + Math.cos(a) * .019); }), .0016).castShadow = false;
    // Thick, nearly straight brows, a touch heavier at the inner end.
    tube(head, brows, Array.from({ length: 6 }, (_, i) => { const t = i / 5; return surface(s * (.15 + t * .44), .335 + Math.sin(t * Math.PI) * .03 - t * .035, .95, .003); }), .0068, .5);
    sphere(head, blush, surface(s * .5, -.42, .8, -.006).toArray() as XYZ, [.02, .011, .01]).castShadow = false;
    // Round wire frames, big as in the sheet, and temples back to the ears.
    const lensCenter = eyeFrame.position.clone().add(new THREE.Vector3(0, .003, .022));
    const ring = mesh(new THREE.TorusGeometry(.04, .0021, 8, 48), frame, head, [lensCenter.x, lensCenter.y, lensCenter.z]); ring.rotation.y = s * .14;
    tube(head, frame, [[lensCenter.x + s * .039, lensCenter.y + .008, lensCenter.z - .008], [s * .104, .018, .074], [s * .118, .014, .0], [s * .113, -.018, -.05]], .0017);
  }
  {
    const l = surfaceFrame(-.37, -.02, .93).position, r = surfaceFrame(.37, -.02, .93).position;
    tube(head, frame, [[l.x + .036, l.y + .016, l.z + .02], [0, l.y + .012, surface(0, .02, 1).z + .008], [r.x - .036, r.y + .016, r.z + .02]], .0018);
  }
  sphere(head, skin, surface(0, -.29, .95, -.005).toArray() as XYZ, [.015, .012, .013]);
  for (const s of [-1, 1]) sphere(head, skin, surface(s * .1, -.33, .95, -.007).toArray() as XYZ, [.008, .007, .007]);
  // A small closed smile, lifted a little more on one side.
  tube(head, lip, Array.from({ length: 7 }, (_, i) => { const t = i / 6 - .5; return surface(t * .3, -.56 + (t * 2) ** 2 * .05 + t * .012, .84, -.0005); }), .0024);
  tube(head, blush, Array.from({ length: 5 }, (_, i) => { const t = i / 4 - .5; return surface(t * .18, -.635, .78, -.002); }), .004).castShadow = false;

  // Hair: soft, wavy and full, in chunky clumps over a dark cap. The clumps
  // grow from a crown whorl, sweep across the forehead toward his left and
  // curl out over the ears and at the nape, the way the sheet draws it.
  const cap = new THREE.SphereGeometry(1, 56, 40), cp = cap.getAttribute("position");
  for (let i = 0; i < cp.count; i++) {
    d.set(cp.getX(i), cp.getY(i), cp.getZ(i)).normalize();
    const inside = smooth(d.y, hairline(d) - .06, hairline(d) + .02);
    const r = headRadius(d) * (.9 + .1 * inside) + .012 * inside;
    cp.setXYZ(i, d.x * r, d.y * r, d.z * r);
  }
  cap.computeVertexNormals(); mesh(cap, hair, head, [0, 0, 0]);
  const rnd = (i: number) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  type Lock = { lift?: number; flick?: number; bend?: XYZ; wave?: number; phase?: number; base?: number };
  function lock(material: THREE.Material, from: XYZ, to: XYZ, width: number, { lift = .03, flick = .012, bend = [0, 0, 0], wave = .06, phase = 0, base = .014 }: Lock = {}) {
    const a = new THREE.Vector3(...from).normalize(), b = new THREE.Vector3(...to).normalize(), bendV = new THREE.Vector3(...bend);
    const across = new THREE.Vector3().crossVectors(a.clone().add(b), b.clone().sub(a)).normalize();
    const K = 22, M = 10, positions: number[] = [], index: number[] = [];
    const path = Array.from({ length: K }, (_, k) => {
      const t = k / (K - 1);
      const dir = a.clone().lerp(b, t).addScaledVector(bendV, Math.sin(t * Math.PI)).addScaledVector(across, wave * Math.sin(t * Math.PI * 2.2 + phase) * smooth(t, 0, .35)).normalize();
      return dir.multiplyScalar(headRadius(dir) + base + lift * Math.sin(Math.min(1, t * 1.08) * Math.PI) ** .55 + flick * smooth(t, .6, 1) ** 2);
    });
    for (let k = 0; k < K; k++) {
      const t = k / (K - 1), p = path[k];
      const tangent = path[Math.min(K - 1, k + 1)].clone().sub(path[Math.max(0, k - 1)]).normalize();
      const out = p.clone().normalize(); out.sub(tangent.clone().multiplyScalar(out.dot(tangent))).normalize();
      const side = new THREE.Vector3().crossVectors(tangent, out);
      const w = width * Math.min(1, .6 + t * 2.4) * (1 - t ** 2.2) + .0008, h = w * .42 + .003 * (1 - t);
      for (let m = 0; m < M; m++) {
        const theta = m / M * Math.PI * 2;
        const v = p.clone().addScaledVector(side, Math.cos(theta) * w).addScaledVector(out, Math.sin(theta) * h * (Math.sin(theta) > 0 ? 1 : .55));
        positions.push(v.x, v.y, v.z);
      }
    }
    for (let k = 0; k < K - 1; k++) for (let m = 0; m < M; m++) {
      const i0 = k * M + m, i1 = k * M + (m + 1) % M, j0 = i0 + M, j1 = i1 + M;
      index.push(i0, j0, i1, i1, j0, j1);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(index); g.computeVertexNormals();
    return mesh(g, material, head, [0, 0, 0]);
  }
  const shade = (j: number) => (j % 3 === 1 ? hairLight : hair);
  // Back and nape: full, falling from the crown to a soft, wavy edge.
  for (let j = 0; j < 12; j++) {
    const t = j / 11, a = Math.PI * (.6 + t * .8);
    lock(shade(j), [-.1 + (t - .5) * .5, .96, -.1], [Math.sin(a) * .9, -.36 - .12 * Math.sin(t * Math.PI) + rnd(j + 20) * .08, Math.cos(a) * .9], .05, { lift: .03, flick: .026, wave: .1, phase: j * 1.7, bend: [0, .02, -.14], base: .012 + (j % 2) * .006 });
  }
  // Over the ears: clumps that round the temples and curl out at the tips.
  for (const s of [-1, 1]) for (let j = 0; j < 5; j++) {
    const t = j / 4;
    lock(shade(j + 1), [s * .35, .92, .15 - t * .6], [s * .99, .16 - t * .2, .38 - t * .9], .05, { lift: .034, flick: .03, wave: .06, phase: j * 2.3 + s, bend: [s * .12, .1, 0], base: .018 });
  }
  // Top: the volume, swept forward from the crown and across to his left.
  for (let j = 0; j < 8; j++) {
    const t = j / 7, x = -.62 + t * 1.24;
    lock(shade(j), [x * .5 - .14, .92, -.3], [x + .12, .74 - Math.abs(x) * .2, .62], .06, { lift: .036 + .014 * Math.sin(t * Math.PI), flick: .024, wave: .05, phase: j * 1.3, bend: [.05, .1, 0], base: .022 });
  }
  // Fringe: wavy pieces falling over the forehead and toward his left.
  for (let j = 0; j < 7; j++) {
    const t = j / 6, x = -.62 + t * 1.2;
    lock(shade(j + 2), [x - .18, .86, .18], [x + .22 + rnd(j) * .06, .28 + .1 * Math.abs(t - .45) + .35 * Math.max(0, Math.abs(x + .2) - .45) + rnd(j + 9) * .05, .92 - Math.abs(x) * .3], .046 + rnd(j + 3) * .01, { lift: .024, flick: .012, wave: .07, phase: 1 + j * 2.1, bend: [0, .1, .1], base: .01 });
  }
  // The crown: a whorl of short clumps so the back has no seam.
  for (let j = 0; j < 5; j++) { const a = j / 5 * Math.PI * 2; lock(shade(j), [-.1, .95, -.3], [-.1 + Math.sin(a) * .55, .62, -.3 + Math.cos(a) * .55], .05, { lift: .03, flick: .012, wave: .05, phase: j }); }
  // A few loose strands lifting out of the top, as in the sheet.
  for (const [x, z, h, r] of [[-.3, -.1, .05, .7], [.05, -.25, .06, .4], [.38, .05, .05, 1.1], [-.05, .3, .045, .2]] as [number, number, number, number][])
    lock(hairLight, [x, .97, z], [x + .3 * Math.cos(r), .9, z + .3 * Math.sin(r) + .2], .03, { lift: h, flick: .03, wave: .05, phase: x * 5 });

  // Limbs hang off bones; rigid parts keep the silhouette clean.
  const legs: { hip: THREE.Bone; knee: THREE.Bone; foot: THREE.Group }[] = [];
  const arms: { shoulder: THREE.Bone; elbow: THREE.Bone; hand: THREE.Group; index: THREE.Group; side: number }[] = [];
  for (const s of [-1, 1]) {
    const suffix = s < 0 ? "L" : "R";
    const hip = new THREE.Bone(); hip.name = `Thigh.${suffix}`; hip.position.set(s * .098, .87, 0); body.add(hip);
    capsule(hip, trousers, [0, -.19, 0], .094, .28);
    tube(hip, seam, [[s * .018, .005, .094], [s * .05, -.05, .084], [s * .082, -.12, .045]], .005); // front pocket
    box(hip, trousers, [s * .093, -.26, .01], [.03, .14, .115], .012); // cargo pocket
    box(hip, seam, [s * .1, -.198, .01], [.026, .03, .12], .01);
    const knee = new THREE.Bone(); knee.name = `Shin.${suffix}`; knee.position.y = -.39; hip.add(knee);
    capsule(knee, trousers, [0, -.15, 0], .086, .22);
    mesh(new THREE.TorusGeometry(.083, .023, 10, 28), trousers, knee, [0, -.3, 0]).rotation.x = Math.PI / 2; // rolled cuff
    mesh(new THREE.CylinderGeometry(.046, .05, .06, 18), tee, knee, [0, -.33, .005]); // white socks
    const foot = new THREE.Group(); foot.name = `Foot.${suffix}`; foot.position.set(0, -.355, .025); knee.add(foot);
    // Grey runner: dark outsole, chunky white midsole, suede overlays, big N.
    box(foot, outsole, [0, -.107, .05], [.15, .026, .3], .012);
    box(foot, sole, [0, -.08, .05], [.156, .052, .3], .022);
    sphere(foot, upper, [0, -.045, .045], [.076, .068, .142]);
    sphere(foot, suede, [0, -.056, .14], [.07, .044, .058]);
    sphere(foot, suede, [0, -.042, -.065], [.068, .058, .046]);
    mesh(new THREE.TorusGeometry(.046, .012, 8, 24), upper, foot, [0, .01, -.02], [1.1, 1.25, 1]).rotation.x = Math.PI / 2 - .2;
    for (const side of [-1, 1]) { const decal = mesh(new THREE.PlaneGeometry(.065, .065), logo, foot, [side * .078, -.045, .045]); decal.rotation.y = side * Math.PI / 2; }
    legs.push({ hip, knee, foot });

    const shoulder = new THREE.Bone(); shoulder.name = `UpperArm.${suffix}`; shoulder.position.set(s * .205, 1.365, 0); body.add(shoulder);
    sphere(shoulder, knit, [-s * .006, -.022, 0], [.062, .062, .062]);
    capsule(shoulder, knit, [0, -.145, 0], .06, .2);
    const elbow = new THREE.Bone(); elbow.name = `Forearm.${suffix}`; elbow.position.set(0, -.29, 0); shoulder.add(elbow);
    capsule(elbow, knit, [0, -.105, 0], .056, .16);
    mesh(new THREE.CylinderGeometry(.05, .05, .05, 20), rib, elbow, [0, -.215, 0]);
    // Hand: palm, curled fingers, a thumb and an index finger that can point.
    const hand = new THREE.Group(); hand.position.set(0, -.245, .005); elbow.add(hand);
    sphere(hand, skin, [0, -.045, 0], [.034, .046, .021]);
    sphere(hand, skin, [s * -.004, -.088, .011], [.03, .023, .019]);
    const thumb = capsule(hand, skin, [-s * .028, -.048, .017], .0105, .026); thumb.rotation.z = -s * .5;
    const index = new THREE.Group(); index.position.set(s * .015, -.082, .006); hand.add(index);
    capsule(index, skin, [0, -.028, 0], .009, .042);
    arms.push({ shoulder, elbow, hand, index, side: s });
    // Leather backpack straps over the shoulders, each with a brass buckle.
    tube(body, leather, [[s * .1, .98, .138], [s * .108, 1.18, .15], [s * .118, 1.34, .118], [s * .122, 1.44, .02], [s * .12, 1.39, -.13]], .019, .5);
    const buckle = new THREE.Group(); buckle.position.set(s * .108, 1.2, .156); buckle.rotation.x = -.08; body.add(buckle);
    mesh(new THREE.TorusGeometry(.024, .0045, 6, 4), brass, buckle, [0, 0, 0], [1.05, .8, 1]).rotation.z = Math.PI / 4;
    box(buckle, darkLeather, [0, -.045, .003], [.034, .06, .008], .004);
  }

  // Dark leather backpack: buckled flap, studs, side pockets and a gold "h".
  const pack = new THREE.Group(); pack.position.set(0, 1.15, -.19); body.add(pack);
  box(pack, leather, [0, 0, -.03], [.34, .42, .16], .065);
  box(pack, darkLeather, [0, .13, -.058], [.35, .18, .16], .055);
  box(pack, leather, [0, -.1, -.118], [.25, .16, .05], .028);
  box(pack, darkLeather, [0, .055, -.142], [.045, .19, .012], .006);
  mesh(new THREE.TorusGeometry(.022, .004, 6, 4), brass, pack, [0, .02, -.15], [1.05, .8, 1]).rotation.z = Math.PI / 4;
  for (const [x, y] of [[-.15, .2], [.15, .2], [-.15, -.19], [.15, -.19], [-.11, -.03], [.11, -.03], [-.11, -.17], [.11, -.17]]) sphere(pack, brass, [x, y, x === .15 || x === -.15 ? -.11 : -.144], [.007, .007, .006]);
  tube(pack, darkLeather, [[-.055, .2, -.03], [-.035, .26, -.035], [0, .275, -.035], [.035, .26, -.035], [.055, .2, -.03]], .011);
  for (const s of [-1, 1]) {
    box(pack, leather, [s * .185, -.06, -.03], [.05, .21, .12], .02);
    box(pack, darkLeather, [s * .212, 0, -.03], [.006, .1, .02], .003);
    mesh(new THREE.TorusGeometry(.012, .0028, 6, 4), brass, pack, [s * .214, .0, -.03], [1, .8, 1]).rotation.set(0, Math.PI / 2, Math.PI / 4);
  }
  const monogram = canvasTexture(128, 128, ctx => { ctx.fillStyle = "#e0b062"; ctx.font = "84px Georgia"; ctx.textAlign = "center"; ctx.fillText("h", 64, 98); });
  mesh(new THREE.PlaneGeometry(.085, .085), new THREE.MeshStandardMaterial({ map: monogram, transparent: true, roughness: .4, metalness: .6, depthWrite: false }), pack, [0, -.1, -.144]).rotation.y = Math.PI;

  // Merge static parts per joint and material, so the figure stays a handful of draw calls.
  function batch(group: THREE.Object3D) {
    group.children.filter(c => c instanceof THREE.Group || c instanceof THREE.Bone).forEach(batch);
    const groups = new Map<THREE.Material, THREE.Mesh[]>();
    for (const c of group.children) if (c instanceof THREE.Mesh && !Array.isArray(c.material)) { const list = groups.get(c.material) ?? []; list.push(c); groups.set(c.material, list); }
    for (const [material, parts] of groups) {
      if (parts.length < 2) continue;
      const geometries = parts.map(part => {
        part.updateMatrix();
        const g = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
        for (const name of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(name)) g.deleteAttribute(name);
        if (!g.getAttribute("uv")) g.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(g.getAttribute("position").count * 2), 2));
        return g.applyMatrix4(part.matrix);
      });
      const merged = mergeGeometries(geometries, false);
      if (merged) {
        const shadow = parts.some(part => part.castShadow);
        parts.forEach(part => { group.remove(part); part.geometry.dispose(); });
        mesh(merged, material, group, [0, 0, 0]).castShadow = shadow;
      }
      geometries.forEach(g => g.dispose());
    }
  }
  batch(body);
  root.updateMatrixWorld(true);
  let phase = 0, lastTime = 0, blend = 0, inspection = 0, inspectUntil = 0, thinking = 0, nextBlink = 2.5;
  const ease = (value: number, target: number, rate: number, dt: number, reduced: boolean) => reduced ? target : THREE.MathUtils.damp(value, target, rate, dt);
  return {
    root,
    inspect(time: number) {
      inspectUntil = time + 1.6; inspection = 1;
    },
    update(time: number, speed: number, reduced: boolean, nearby = false) {
      const dt = Math.min(.05, Math.max(0, time - lastTime)); lastTime = time;
      const running = THREE.MathUtils.clamp((speed - 2.5) / 2.3, 0, 1);
      blend = THREE.MathUtils.damp(blend, Math.min(1, speed / 2), 12, dt);
      phase += dt * (7.1 + running * 3.4);
      inspection = ease(inspection, time < inspectUntil ? 1 : 0, 9, dt, reduced);
      // Standing by a display: a hand to the chin, thinking it over.
      thinking = ease(thinking, nearby && speed < .1 && inspection < .5 ? 1 : 0, 5, dt, reduced);
      const still = 1 - blend, amplitude = blend * (reduced ? .22 : .44 + running * .23);
      legs.forEach(({ hip, knee, foot }, i) => {
        const wave = Math.sin(phase + i * Math.PI);
        hip.rotation.x = wave * amplitude - running * blend * .12;
        hip.rotation.z = (i ? 1 : -1) * .025 * still;
        knee.rotation.x = (Math.max(0, -wave) * (.55 + running * .65) + .06 * running) * blend;
        foot.rotation.x = -hip.rotation.x * .25 - knee.rotation.x * .38 + Math.max(0, wave) * .12 * blend;
      });
      arms.forEach(({ shoulder, elbow, hand, index, side }, i) => {
        const wave = Math.sin(phase + i * Math.PI);
        const point = i === 1 ? inspection : 0, chin = i === 0 ? thinking * (1 - inspection) : 0;
        // Relaxed: hands in the front pockets. Walking: a natural swing.
        const pocket = still * (1 - point) * (1 - chin);
        let x = -wave * amplitude * .72 + pocket * .12, z = side * (.06 + running * blend * .08) - pocket * side * .04, bend = -.14 - running * blend * 1.05 - pocket * .41;
        // Point at the display: arm forward and up, index finger out.
        x = THREE.MathUtils.lerp(x, -1.38, point); z = THREE.MathUtils.lerp(z, side * .14, point); bend = THREE.MathUtils.lerp(bend, -.12, point);
        x = THREE.MathUtils.lerp(x, -1.3, chin); z = THREE.MathUtils.lerp(z, -side * .02, chin); bend = THREE.MathUtils.lerp(bend, -2.27, chin);
        shoulder.rotation.set(x, 0, z); elbow.rotation.set(bend, 0, -side * (chin * .64 + pocket * .3));
        hand.rotation.set(pocket * .2 - chin * .2, point * side * 1.5, side * pocket * -.15);
        hand.scale.setScalar(1 - pocket * .35); hand.position.z = .005 - pocket * .03;
        index.rotation.x = point > .5 ? 0 : 1.4;
      });
      const idle = reduced ? 0 : still * (1 - inspection);
      body.position.y = reduced ? 0 : Math.abs(Math.sin(phase)) * blend * (.018 + running * .02) - idle * .004 * (1 + Math.sin(time * 1.6));
      body.rotation.x = reduced ? 0 : running * blend * .075;
      body.rotation.z = reduced ? 0 : Math.sin(phase) * blend * .015 + idle * Math.sin(time * .5) * .012;
      body.rotation.y = reduced ? 0 : Math.sin(phase) * blend * .045;
      pack.rotation.x = reduced ? 0 : Math.sin(phase - .22) * blend * (.022 + running * .03);
      // Looking around the room when idle; toward the display when close.
      const glance = reduced ? 0 : .34 * Math.sin(time * .41) * smooth(Math.sin(time * .13), -.1, .5) * (1 - thinking);
      head.rotation.y = reduced ? 0 : speed > .1 ? -body.rotation.y : glance * (1 - inspection) + inspection * .22 + thinking * .12;
      head.rotation.x = (nearby && speed < .1 ? -.06 - inspection * .1 + thinking * .05 : running * blend * -.05);
      head.rotation.z = reduced ? 0 : thinking * .08;
      // Blink every few seconds.
      if (time > nextBlink + .14) nextBlink = time + 2.2 + ((time * 7.3) % 2.6);
      const closed = !reduced && time > nextBlink && time < nextBlink + .14;
      blinkers.forEach(lid => { lid.rotation.x = closed ? SHUT : OPEN; });
    },
  };
}
