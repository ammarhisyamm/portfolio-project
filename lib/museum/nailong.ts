import * as THREE from "three";

export type NailongMood = "neutral" | "happy" | "talk" | "cheer" | "grumpy" | "surprised";
export type NailongGesture = "idle" | "wave" | "cheer" | "reach" | "chest" | "gasp";

// Head centre and radii in Nailong's own space (front is +z, feet at y = 0).
const HEAD = new THREE.Vector3(0, 1.04, .03), RADII = new THREE.Vector3(.43, .43, .39);
const NECK = new THREE.Vector3(0, .76, .02);
// One even lemon yellow all over, as in the turnaround, with a soft pink blush.
const YELLOW = new THREE.Color("#ffda3a"), CHEEK = new THREE.Color("#ff9a8b");
// Her chestnut bob: straight bangs over the brow, sides that fall to the jaw.
const BANGS = 1.21, BOB = 2.2;

/** Radius of the head along a unit direction: an egg with chubby jowls, a
 * soft muzzle and a slightly narrower crown, like the reference sheets. */
function headRadius(d: THREE.Vector3) {
  const ellipsoid = 1 / Math.sqrt((d.x / RADII.x) ** 2 + (d.y / RADII.y) ** 2 + (d.z / RADII.z) ** 2);
  const lower = THREE.MathUtils.smoothstep(-d.y, 0, .6), front = Math.max(0, d.z);
  const jowl = 1 + .17 * lower * (.5 + .5 * front);
  const crown = 1 - .03 * Math.max(0, d.y);
  const muzzle = 1 + .1 * Math.exp(-((d.x / .42) ** 2 + ((d.y + .28) / .3) ** 2)) * front;
  return ellipsoid * jowl * crown * muzzle;
}
const surface = (x: number, y: number, z: number) => { const d = new THREE.Vector3(x, y, z).normalize(); return d.multiplyScalar(headRadius(d)); };
function surfaceFrame(x: number, y: number, z: number, forward = .35) {
  const p = surface(x, y, z), e = .01;
  const u = surface(x + e, y, z).sub(surface(x - e, y, z)), v = surface(x, y + e, z).sub(surface(x, y - e, z));
  const normal = new THREE.Vector3().crossVectors(u, v).normalize();
  if (normal.z < 0) normal.negate();
  normal.lerp(new THREE.Vector3(0, 0, 1), forward).normalize();
  return { position: p, quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal) };
}

function irisTexture() {
  const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fbfaf4"; ctx.fillRect(0, 0, 512, 256);
  // The sphere's front (+z) sits at u = .25, v = .5.
  // A big glossy black pupil inside a thin green ring, then white.
  const iris = ctx.createRadialGradient(128, 128, 4, 128, 128, 64);
  iris.addColorStop(0, "#050806"); iris.addColorStop(.5, "#0a120b"); iris.addColorStop(.56, "#1d6a2a"); iris.addColorStop(.8, "#3fae46"); iris.addColorStop(.95, "#24722c"); iris.addColorStop(1, "#14401a");
  ctx.fillStyle = iris; ctx.beginPath(); ctx.arc(128, 128, 64, 0, Math.PI * 2); ctx.fill();
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
  return texture;
}

/** Strands for the bob: u runs around the head (front at .5), v from the crown down. */
function hairTexture() {
  const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const shade = ctx.createLinearGradient(0, 0, 0, 128); shade.addColorStop(0, "#6a4029"); shade.addColorStop(1, "#4a2a1a");
  ctx.fillStyle = shade; ctx.fillRect(0, 0, 512, 128);
  let seed = 7; const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 170; i++) {
    const x = random() * 512;
    ctx.strokeStyle = random() > .5 ? `rgba(150,98,64,${.1 + random() * .14})` : `rgba(38,20,12,${.1 + random() * .14})`;
    ctx.lineWidth = 1 + random() * 2.2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (random() - .5) * 6, 128); ctx.stroke();
  }
  // A centre parting from the crown to the front of the bangs.
  ctx.strokeStyle = "rgba(34,17,10,.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(256, 0); ctx.lineTo(256, 34); ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.wrapS = THREE.RepeatWrapping; texture.anisotropy = 4;
  return texture;
}

/** Where the hair ends, as an angle from the crown: high over the brow in
 * front (the bangs), down to the jaw at the sides and back (the bob). */
function hairEdge(theta: number) {
  const side = THREE.MathUtils.smoothstep(Math.abs(theta), .66, 1.08);
  const fringe = (1 - side) * .025 * Math.sin(theta * 16);
  return THREE.MathUtils.lerp(BANGS, BOB, side) + fringe;
}
/** A point on the hair shell: the head surface, puffed out a little, with the
 * bob flaring at its ends. Front is theta = 0. */
function hairPoint(theta: number, phi: number, into = new THREE.Vector3()) {
  const d = into.set(Math.sin(phi) * Math.sin(theta), Math.cos(phi), Math.sin(phi) * Math.cos(theta));
  const side = THREE.MathUtils.smoothstep(Math.abs(theta), .66, 1.08);
  const ends = THREE.MathUtils.smoothstep(phi / hairEdge(theta), .55, 1);
  return d.multiplyScalar(headRadius(d) * (1.065 + .055 * Math.max(0, d.y) + .05 * ends * side + .025 * (1 - side)));
}

/** A heart, the shape of her hair clips, centred and pointing down. */
function heartGeometry(width: number) {
  const s = new THREE.Shape();
  s.moveTo(5, 5); s.bezierCurveTo(5, 5, 4, 0, 0, 0); s.bezierCurveTo(-6, 0, -6, 7, -6, 7);
  s.bezierCurveTo(-6, 11, -3, 15.4, 5, 19); s.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
  s.bezierCurveTo(16, 7, 16, 0, 10, 0); s.bezierCurveTo(7, 0, 5, 5, 5, 5);
  const g = new THREE.ExtrudeGeometry(s, { depth: 4, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.6, bevelSegments: 4, curveSegments: 16 });
  g.center(); g.rotateZ(Math.PI); g.scale(width / 25, width / 25, width / 25);
  return g;
}

/** Nailong: a chubby lemon-yellow dinosaur built from soft, readable
 * primitives (round head, pear body, big cream belly, stubby clawed paws and
 * a thick tail that curls up), with blinking eyelids, the mouth shapes of the
 * expression sheet and gesture poses. She wears a chestnut bob with straight
 * bangs and two pink heart clips, as in the turnaround. */
export function createNailong() {
  const root = new THREE.Group(); root.name = "Nailong";
  const body = new THREE.Group(); root.add(body);
  const geometries: THREE.BufferGeometry[] = [], materials: THREE.Material[] = [], textures: THREE.Texture[] = [];
  const track = <T extends THREE.BufferGeometry>(g: T) => { geometries.push(g); return g; };
  const material = <T extends THREE.Material>(m: T) => { materials.push(m); return m; };
  const skin = material(new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .62, sheen: .3, sheenColor: "#fff6c8", sheenRoughness: .5 }));
  const limb = material(new THREE.MeshPhysicalMaterial({ color: YELLOW, roughness: .62, sheen: .3, sheenColor: "#fff6c8", sheenRoughness: .5 }));
  const lid = material(new THREE.MeshPhysicalMaterial({ color: YELLOW, roughness: .62, sheen: .3, sheenColor: "#fff6c8" }));
  const cream = material(new THREE.MeshPhysicalMaterial({ color: "#fff1bd", roughness: .72, sheen: .2, sheenColor: "#ffffff" }));
  const claw = material(new THREE.MeshStandardMaterial({ color: "#6e4a32", roughness: .45 }));
  const irisMap = irisTexture(); textures.push(irisMap);
  const eyeball = material(new THREE.MeshPhysicalMaterial({ map: irisMap, roughness: .12, clearcoat: 1, clearcoatRoughness: .05 }));
  const glint = material(new THREE.MeshBasicMaterial({ color: "#ffffff" }));
  const mouthDark = material(new THREE.MeshStandardMaterial({ color: "#6a1f22", roughness: .7 }));
  const tongue = material(new THREE.MeshStandardMaterial({ color: "#f07f86", roughness: .6 }));
  const line = material(new THREE.MeshStandardMaterial({ color: "#4a2216", roughness: .6 }));
  const ball = track(new THREE.SphereGeometry(1, 28, 20));
  function add(parent: THREE.Object3D, geometry: THREE.BufferGeometry, m: THREE.Material, pos: [number, number, number], scale: [number, number, number] = [1, 1, 1]) {
    const mesh = new THREE.Mesh(geometry, m); mesh.position.set(...pos); mesh.scale.set(...scale);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }

  // Pear-shaped body under the big round head.
  const profile: [number, number][] = [[0, .14], [.2, .15], [.3, .2], [.36, .29], [.385, .42], [.38, .53], [.365, .62], [.34, .7], [.3, .78], [.21, .86], [0, .9]];
  const torso = track(new THREE.LatheGeometry(new THREE.SplineCurve(profile.map(([r, y]) => new THREE.Vector2(r, y))).getPoints(40), 64));
  torso.scale(1, 1, .88);
  const torsoColors: number[] = [];
  const position = torso.getAttribute("position");
  for (let i = 0; i < position.count; i++) torsoColors.push(YELLOW.r, YELLOW.g, YELLOW.b);
  torso.setAttribute("color", new THREE.Float32BufferAttribute(torsoColors, 3));
  add(body, torso, skin, [0, 0, 0]);
  add(body, track(new THREE.SphereGeometry(1, 48, 36)), cream, [0, .44, .165], [.28, .32, .21]);

  // Head: a sculpted egg on a neck pivot so it can look and tilt.
  const neck = new THREE.Group(); neck.position.copy(NECK); body.add(neck);
  const head = new THREE.Group(); head.position.copy(HEAD).sub(NECK); neck.add(head);
  const skull = track(new THREE.SphereGeometry(1, 72, 54));
  const sp = skull.getAttribute("position"), headColors: number[] = [], d = new THREE.Vector3();
  const cheeks = [-1, 1].map(s => new THREE.Vector3(s * .56, -.3, .77).normalize());
  for (let i = 0; i < sp.count; i++) {
    d.set(sp.getX(i), sp.getY(i), sp.getZ(i)).normalize();
    const r = headRadius(d); sp.setXYZ(i, d.x * r, d.y * r, d.z * r);
    const c = YELLOW.clone();
    for (const cheek of cheeks) c.lerp(CHEEK, .42 * Math.exp(-((d.distanceTo(cheek) / .24) ** 2)));
    headColors.push(c.r, c.g, c.b);
  }
  skull.setAttribute("color", new THREE.Float32BufferAttribute(headColors, 3)); skull.computeVertexNormals();
  add(head, skull, skin, [0, 0, 0]);

  // Eyes: glossy eyeballs that can roll, under upper and lower lids.
  const lidTop = track(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2));
  const lidBottom = track(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2));
  const eyes = [-1, 1].map(s => {
    const frame = surfaceFrame(s * .43, .0, .9);
    const socket = new THREE.Group(); socket.position.copy(frame.position); socket.quaternion.copy(frame.quaternion); socket.scale.set(1, 1.12, 1); head.add(socket);
    const globe = add(socket, ball, eyeball, [0, 0, -.055], [.092, .092, .092]);
    // The glint pokes just past the eyeball but stays under the lids when they close.
    const shine = add(globe, ball, glint, [.272, .34, .855], [.17, .17, .07]); shine.castShadow = false;
    shine.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), shine.position.clone().normalize());
    const upper = add(socket, lidTop, lid, [0, 0, -.055], [.095, .095, .095]);
    const lower = add(socket, lidBottom, lid, [0, 0, -.055], [.0945, .0945, .0945]);
    // Closed, smiling eyes: a dark arch drawn over the shut lid.
    const arch = new THREE.CatmullRomCurve3(Array.from({ length: 9 }, (_, i) => {
      const a = -.85 + i / 8 * 1.7, x = .078 * Math.sin(a), y = -.004 + .034 * Math.cos(a * 1.25);
      return new THREE.Vector3(x, y, Math.sqrt(Math.max(0, .0968 ** 2 - x * x - y * y)) - .055);
    }));
    const smiling = add(socket, track(new THREE.TubeGeometry(arch, 20, .0065, 8)), line, [0, 0, 0]); smiling.visible = false;
    return { side: s, globe, upper, lower, smiling };
  });

  // Mouth: a smile line (a frown when flipped), an open D-shaped smile with
  // a pink tongue, and a round "O" for cheering and surprise.
  const mouthFrame = surfaceFrame(0, -.3, .95, .2);
  const mouth = new THREE.Group(); mouth.position.copy(mouthFrame.position); mouth.quaternion.copy(mouthFrame.quaternion); head.add(mouth);
  const smileCurve = new THREE.CatmullRomCurve3(Array.from({ length: 7 }, (_, i) => { const x = -.06 + i / 6 * .12; return new THREE.Vector3(x, .024 * (x / .06) ** 2 - .008, -x * x / .8 + .002); }));
  const smile = add(mouth, track(new THREE.TubeGeometry(smileCurve, 24, .0062, 8)), line, [0, 0, 0]);
  const half = track(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2));
  const grin = new THREE.Group(); mouth.add(grin);
  add(grin, half, mouthDark, [0, 0, -.012], [1, 1, .32]);
  add(grin, ball, tongue, [0, -.62, .02], [.6, .36, .26]);
  const round = new THREE.Group(); mouth.add(round);
  add(round, ball, mouthDark, [0, 0, -.012], [1, 1, .3]);
  add(round, ball, tongue, [0, -.55, .04], [.62, .4, .25]);

  // The bob: one shell from the crown down to the bangs in front and the jaw
  // at the sides, with a rounded rim along its ends.
  const hairMap = hairTexture(); textures.push(hairMap);
  const hairMat = material(new THREE.MeshPhysicalMaterial({ map: hairMap, roughness: .55, sheen: .5, sheenColor: "#c48a5c", sheenRoughness: .45, side: THREE.DoubleSide }));
  const rimMat = material(new THREE.MeshPhysicalMaterial({ color: "#4f2d1c", roughness: .58, sheen: .4, sheenColor: "#b07a50" }));
  const COLS = 120, ROWS = 30, hairPos: number[] = [], hairUv: number[] = [], hairIndex: number[] = [], p = new THREE.Vector3();
  for (let i = 0; i <= COLS; i++) {
    const theta = -Math.PI + i / COLS * Math.PI * 2, edge = hairEdge(theta);
    for (let j = 0; j <= ROWS; j++) { hairPoint(theta, Math.max(.001, edge * j / ROWS), p); hairPos.push(p.x, p.y, p.z); hairUv.push(i / COLS, 1 - j / ROWS); }
  }
  for (let i = 0; i < COLS; i++) for (let j = 0; j < ROWS; j++) {
    const a = i * (ROWS + 1) + j, b = (i + 1) * (ROWS + 1) + j;
    hairIndex.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const hairShell = track(new THREE.BufferGeometry());
  hairShell.setAttribute("position", new THREE.Float32BufferAttribute(hairPos, 3));
  hairShell.setAttribute("uv", new THREE.Float32BufferAttribute(hairUv, 2));
  hairShell.setIndex(hairIndex); hairShell.computeVertexNormals();
  // Smooth the seam at the back and point the crown straight up.
  const hn = hairShell.getAttribute("normal") as THREE.BufferAttribute, n0 = new THREE.Vector3(), n1 = new THREE.Vector3();
  for (let j = 0; j <= ROWS; j++) {
    const a = j, b = COLS * (ROWS + 1) + j;
    n0.fromBufferAttribute(hn, a).add(n1.fromBufferAttribute(hn, b)).normalize();
    hn.setXYZ(a, n0.x, n0.y, n0.z); hn.setXYZ(b, n0.x, n0.y, n0.z);
  }
  for (let i = 0; i <= COLS; i++) hn.setXYZ(i * (ROWS + 1), 0, 1, 0);
  add(head, hairShell, hairMat, [0, 0, 0]);
  const rim = new THREE.CatmullRomCurve3(Array.from({ length: COLS }, (_, i) => { const theta = -Math.PI + i / COLS * Math.PI * 2; return hairPoint(theta, hairEdge(theta)); }), true);
  add(head, track(new THREE.TubeGeometry(rim, 240, .024, 8, true)), rimMat, [0, 0, 0]);

  // Two pink heart clips pinned to the bangs.
  const clipMat = material(new THREE.MeshPhysicalMaterial({ color: "#f68fae", roughness: .32, clearcoat: .8, clearcoatRoughness: .2 }));
  const heart = track(heartGeometry(.11));
  for (const s of [-1, 1]) {
    const theta = s * .56, phi = 1.02, at = hairPoint(theta, phi), out = at.clone().normalize();
    const clip = add(head, heart, clipMat, [0, 0, 0]);
    clip.position.copy(at).addScaledVector(out, .012);
    clip.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), out);
    clip.rotateZ(-s * .35);
  }

  // Stubby arms ending in round paws with three tiny brown claws.
  const claws = track(new THREE.ConeGeometry(.017, .042, 10)); claws.rotateX(Math.PI);
  const arms = [-1, 1].map(s => {
    const shoulder = new THREE.Group(); shoulder.position.set(s * .31, .68, .03); body.add(shoulder);
    add(shoulder, track(new THREE.CapsuleGeometry(.1, .16, 6, 16)), limb, [0, -.15, 0]);
    add(shoulder, ball, limb, [0, -.27, .005], [.115, .1, .105]);
    for (const dx of [-.048, 0, .048]) add(shoulder, claws, claw, [dx, -.36, .03]).rotation.set(-.25, 0, dx * 3.4);
    const hand = new THREE.Object3D(); hand.position.set(0, -.3, .06); shoulder.add(hand);
    return { side: s, shoulder, hand };
  });

  // Short legs with wide feet and toe claws.
  const legs = [-1, 1].map(s => {
    const hip = new THREE.Group(); hip.position.set(s * .18, .24, .02); body.add(hip);
    add(hip, track(new THREE.CapsuleGeometry(.13, .06, 6, 16)), limb, [0, -.07, 0]);
    add(hip, ball, limb, [0, -.155, .05], [.15, .085, .19]);
    for (const dx of [-.062, 0, .062]) add(hip, ball, claw, [dx, -.2, .225], [.028, .02, .03]);
    return { side: s, hip };
  });

  // A thick tapered tail that sweeps back low and curls up at the tip, and wags.
  const tail = new THREE.Group(); tail.position.set(0, .3, -.24); body.add(tail);
  const tailCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, .02, .08), new THREE.Vector3(0, -.08, -.1), new THREE.Vector3(0, -.15, -.28), new THREE.Vector3(0, -.13, -.45), new THREE.Vector3(0, -.04, -.58), new THREE.Vector3(0, .07, -.63)]);
  const tailShape = track(new THREE.TubeGeometry(tailCurve, 32, 1, 16));
  const tp = tailShape.getAttribute("position"), ring = new THREE.Vector3(), centre = new THREE.Vector3();
  for (let i = 0; i < tp.count; i++) {
    const t = Math.floor(i / 17) / 32, r = THREE.MathUtils.lerp(.17, .03, t ** .8);
    tailCurve.getPointAt(t, centre); ring.set(tp.getX(i), tp.getY(i), tp.getZ(i)).sub(centre).multiplyScalar(r).add(centre); tp.setXYZ(i, ring.x, ring.y, ring.z);
  }
  tailShape.computeVertexNormals();
  add(tail, tailShape, limb, [0, 0, 0]);
  add(tail, ball, limb, tailCurve.getPointAt(1).toArray() as [number, number, number], [.03, .03, .03]);

  root.traverse(node => { if (node instanceof THREE.Mesh && node.material === glint) node.castShadow = false; });

  let mood: NailongMood = "neutral", gesture: NailongGesture = "idle";
  let reachSide = -1, reachPitch = 0, reachRoll = .15, walking = 0, walkPhase = 0, last = 0;
  let nextBlink = 2, blinkUntil = 0;
  const lookTarget = new THREE.Vector3(); let looking = false;
  const state = { open: 1, lower: 0, tilt: 0, smile: 1, grin: 0, oh: 0, yaw: 0, pitch: 0, roll: 0, hop: 0 };
  const armState = arms.map(() => ({ x: 0, z: 0 }));
  const local = new THREE.Vector3();

  function update(time: number, reduced = false) {
    const dt = Math.min(.05, Math.max(0, time - last)); last = time;
    const ease = (from: number, to: number, speed = 10) => reduced ? to : THREE.MathUtils.damp(from, to, speed, dt);
    if (time > nextBlink) { blinkUntil = time + .13; nextBlink = time + 2.2 + Math.random() * 3.2; }
    const blink = !reduced && time < blinkUntil;
    // The expression sheet: Biasa (neutral), Disapa (talk), Senang (happy),
    // Sorak (cheer), Ngambek (grumpy) and Kaget (surprised). "grin" is the
    // open D smile, "oh" the round mouth; a negative smile is a frown.
    const talking = mood === "talk" ? (reduced ? .8 : .62 + .38 * Math.abs(Math.sin(time * 11))) : 0;
    const target = {
      neutral: { open: 1, lower: 0, tilt: 0, smile: 1, grin: 0, oh: 0 },
      happy: { open: 0, lower: 0, tilt: 0, smile: 0, grin: 1.15, oh: 0 },
      talk: { open: 1, lower: .05, tilt: 0, smile: 0, grin: talking, oh: 0 },
      cheer: { open: 1.08, lower: 0, tilt: 0, smile: 0, grin: 0, oh: .85 },
      grumpy: { open: .52, lower: .18, tilt: .45, smile: -.75, grin: 0, oh: 0 },
      surprised: { open: 1.15, lower: 0, tilt: 0, smile: 0, grin: 0, oh: 1.05 },
    }[mood];
    state.open = ease(state.open, blink ? 0 : target.open, 18); state.lower = ease(state.lower, target.lower);
    state.tilt = ease(state.tilt, target.tilt); state.smile = ease(state.smile, target.smile, 14);
    state.grin = ease(state.grin, target.grin, 16); state.oh = ease(state.oh, target.oh, 16);
    for (const eye of eyes) {
      // Upper lid: tucked back when open, swung over the eyeball when closed.
      eye.upper.rotation.x = THREE.MathUtils.lerp(1.45, -1.3, THREE.MathUtils.clamp(state.open, 0, 1.2));
      eye.upper.rotation.z = eye.side * state.tilt; // inner corners down: a frown
      eye.lower.rotation.x = THREE.MathUtils.lerp(1.35, .55, state.lower);
      eye.smiling.visible = (mood === "happy" || mood === "cheer") && state.open < .25;
    }
    smile.scale.set(state.smile < 0 ? .7 : 1, Math.abs(state.smile) > .001 ? state.smile : .001, 1); smile.visible = Math.abs(state.smile) > .03;
    smile.position.y = state.smile < 0 ? -.012 : 0;
    grin.visible = state.grin > .02; grin.scale.set(.082 + .016 * state.grin, Math.max(.001, .078 * state.grin), .1);
    round.visible = state.oh > .02; round.scale.set(.046 + .012 * state.oh, Math.max(.001, .068 * state.oh), .1);

    // Look toward a world point (eyes first, then the head).
    let yaw = 0, pitch = 0;
    if (looking) {
      root.updateMatrixWorld(); local.copy(lookTarget); root.worldToLocal(local); local.sub(HEAD);
      yaw = THREE.MathUtils.clamp(Math.atan2(local.x, local.z), -.75, .75);
      pitch = THREE.MathUtils.clamp(-Math.atan2(local.y, Math.hypot(local.x, local.z)), -.35, .3);
    }
    const idle = reduced ? 0 : 1;
    state.yaw = ease(state.yaw, yaw * .7 + Math.sin(time * .45) * .05 * idle, 5);
    state.pitch = ease(state.pitch, pitch * .6 + (gesture === "cheer" ? -.2 : 0), 5);
    state.roll = ease(state.roll, (gesture === "wave" ? .14 : mood === "happy" ? .1 : 0) + Math.sin(time * .8) * .03 * idle, 4);
    neck.rotation.set(state.pitch, state.yaw, state.roll);
    for (const eye of eyes) eye.globe.rotation.set(pitch * .5, yaw * .45, 0);

    // Arms per gesture; legs and body rock while walking.
    walking = THREE.MathUtils.clamp(walking, 0, 1);
    walkPhase += dt * 9 * walking;
    arms.forEach((arm, i) => {
      const s = arm.side, swing = reduced ? 0 : Math.sin(walkPhase + (s > 0 ? Math.PI : 0)) * .35 * walking;
      let x = swing, z = s * (.42 + Math.sin(time * 1.7) * .03 * idle);
      if (gesture === "wave" && s < 0) { x = -.45; z = -(2.15 + (reduced ? 0 : Math.sin(time * 10) * .28)); }
      if (gesture === "cheer") { x = -.1; z = s * (2.55 + (reduced ? 0 : Math.sin(time * 8 + s) * .1)); }
      if (gesture === "reach" && s === reachSide) { x = -reachPitch; z = s * reachRoll; }
      // Paws to the chest: both when delighted, one when startled.
      if (gesture === "chest" || (gesture === "gasp" && s > 0)) { x = -1.1; z = -s * .62; }
      const a = armState[i]; a.x = ease(a.x, x, 9); a.z = ease(a.z, z, 9);
      arm.shoulder.rotation.set(a.x, 0, a.z);
    });
    legs.forEach(leg => { leg.hip.rotation.x = reduced ? 0 : Math.sin(walkPhase + (leg.side > 0 ? 0 : Math.PI)) * .55 * walking; });
    state.hop = ease(state.hop, gesture === "cheer" && !reduced ? Math.abs(Math.sin(time * 6)) * .07 : 0, 14);
    body.position.y = state.hop + (reduced ? 0 : Math.abs(Math.sin(walkPhase)) * .035 * walking);
    body.rotation.z = reduced ? 0 : Math.sin(walkPhase) * .09 * walking;
    body.scale.set(1, 1 + (reduced ? 0 : Math.sin(time * 2.1) * .008), 1);
    tail.rotation.y = reduced ? 0 : Math.sin(time * (gesture === "idle" ? 2.2 : 5)) * (gesture === "idle" ? .22 : .38);
  }

  return {
    root, head,
    hand: (side: -1 | 1) => arms.find(arm => arm.side === side)!.hand,
    setMood(next: NailongMood) { mood = next; },
    setGesture(next: NailongGesture) { gesture = next; },
    /** Raise one arm forward (pitch in radians) for holding or reaching. */
    setReach(side: -1 | 1, pitch: number, roll = .15) { reachSide = side; reachPitch = pitch; reachRoll = roll; },
    /** Snap the reaching arm to its pose immediately, e.g. before measuring. */
    poseReach() { arms.forEach((arm, i) => { if (arm.side === reachSide) { armState[i].x = -reachPitch; armState[i].z = arm.side * reachRoll; arm.shoulder.rotation.set(-reachPitch, 0, arm.side * reachRoll); } }); },
    lookAt(point: THREE.Vector3 | null) { looking = !!point; if (point) lookTarget.copy(point); },
    setWalking(amount: number) { walking = amount; },
    update,
    dispose() { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); },
  };
}

export type Nailong = ReturnType<typeof createNailong>;
