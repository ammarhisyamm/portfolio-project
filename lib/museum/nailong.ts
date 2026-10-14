import * as THREE from "three";

export type NailongMood = "neutral" | "happy" | "talk" | "cheer" | "grumpy" | "surprised";
export type NailongGesture = "idle" | "wave" | "cheer" | "reach";

// Head centre and radii in Nailong's own space (front is +z, feet at y = 0).
const HEAD = new THREE.Vector3(0, 1.04, .03), RADII = new THREE.Vector3(.43, .43, .39);
const NECK = new THREE.Vector3(0, .76, .02);
const YELLOW = new THREE.Color("#ffd935"), DEEP = new THREE.Color("#ffc531"), CHEEK = new THREE.Color("#ffab2c"), BODY_LOW = new THREE.Color("#ffb52c");

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
  const iris = ctx.createRadialGradient(128, 128, 4, 128, 128, 58);
  iris.addColorStop(0, "#0d1a10"); iris.addColorStop(.42, "#0f1d12"); iris.addColorStop(.47, "#2f8a3d"); iris.addColorStop(.78, "#5fc160"); iris.addColorStop(.93, "#2d6d33"); iris.addColorStop(1, "#163a1b");
  ctx.fillStyle = iris; ctx.beginPath(); ctx.ellipse(128, 128, 54, 58, 0, 0, Math.PI * 2); ctx.fill();
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
  return texture;
}

/** Nailong: a chubby yellow dinosaur built from soft, readable primitives
 * (egg head, pear body, cream belly, stubby clawed paws and a short tail),
 * with blinking eyelids, a few mouth shapes and gesture poses. */
export function createNailong() {
  const root = new THREE.Group(); root.name = "Nailong";
  const body = new THREE.Group(); root.add(body);
  const geometries: THREE.BufferGeometry[] = [], materials: THREE.Material[] = [], textures: THREE.Texture[] = [];
  const track = <T extends THREE.BufferGeometry>(g: T) => { geometries.push(g); return g; };
  const material = <T extends THREE.Material>(m: T) => { materials.push(m); return m; };
  const skin = material(new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .58, sheen: .25, sheenColor: "#fff2b0", sheenRoughness: .5 }));
  const limb = material(new THREE.MeshPhysicalMaterial({ color: "#ffc230", roughness: .58, sheen: .25, sheenColor: "#fff2b0", sheenRoughness: .5 }));
  const lid = material(new THREE.MeshPhysicalMaterial({ color: "#ffd535", roughness: .58, sheen: .2, sheenColor: "#fff2b0" }));
  const cream = material(new THREE.MeshPhysicalMaterial({ color: "#fff3c4", roughness: .7, sheen: .2, sheenColor: "#ffffff" }));
  const pad = material(new THREE.MeshStandardMaterial({ color: "#f39b98", roughness: .55 }));
  const claw = material(new THREE.MeshStandardMaterial({ color: "#7e5c48", roughness: .45 }));
  const irisMap = irisTexture(); textures.push(irisMap);
  const eyeball = material(new THREE.MeshPhysicalMaterial({ map: irisMap, roughness: .12, clearcoat: 1, clearcoatRoughness: .05 }));
  const glint = material(new THREE.MeshBasicMaterial({ color: "#ffffff" }));
  const mouthDark = material(new THREE.MeshStandardMaterial({ color: "#5c1a1d", roughness: .7 }));
  const tongue = material(new THREE.MeshStandardMaterial({ color: "#e0757c", roughness: .6 }));
  const line = material(new THREE.MeshStandardMaterial({ color: "#5e2c1c", roughness: .6 }));
  const ball = track(new THREE.SphereGeometry(1, 28, 20));
  function add(parent: THREE.Object3D, geometry: THREE.BufferGeometry, m: THREE.Material, pos: [number, number, number], scale: [number, number, number] = [1, 1, 1]) {
    const mesh = new THREE.Mesh(geometry, m); mesh.position.set(...pos); mesh.scale.set(...scale);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }

  // Pear-shaped body, warmer toward the feet.
  const profile: [number, number][] = [[0, .14], [.2, .15], [.3, .2], [.36, .29], [.39, .42], [.385, .53], [.37, .62], [.345, .7], [.3, .78], [.21, .86], [0, .9]];
  const torso = track(new THREE.LatheGeometry(new THREE.SplineCurve(profile.map(([r, y]) => new THREE.Vector2(r, y))).getPoints(40), 64));
  torso.scale(1, 1, .88);
  const torsoColors: number[] = [];
  const position = torso.getAttribute("position");
  for (let i = 0; i < position.count; i++) { const c = BODY_LOW.clone().lerp(DEEP, THREE.MathUtils.smoothstep(position.getY(i), .15, .9)); torsoColors.push(c.r, c.g, c.b); }
  torso.setAttribute("color", new THREE.Float32BufferAttribute(torsoColors, 3));
  add(body, torso, skin, [0, 0, 0]);
  add(body, track(new THREE.SphereGeometry(1, 48, 36)), cream, [0, .43, .17], [.255, .29, .2]);

  // Head: a sculpted egg on a neck pivot so it can look and tilt.
  const neck = new THREE.Group(); neck.position.copy(NECK); body.add(neck);
  const head = new THREE.Group(); head.position.copy(HEAD).sub(NECK); neck.add(head);
  const skull = track(new THREE.SphereGeometry(1, 72, 54));
  const sp = skull.getAttribute("position"), headColors: number[] = [], d = new THREE.Vector3();
  const cheeks = [-1, 1].map(s => new THREE.Vector3(s * .56, -.3, .77).normalize());
  for (let i = 0; i < sp.count; i++) {
    d.set(sp.getX(i), sp.getY(i), sp.getZ(i)).normalize();
    const r = headRadius(d); sp.setXYZ(i, d.x * r, d.y * r, d.z * r);
    const c = DEEP.clone().lerp(YELLOW, THREE.MathUtils.smoothstep(d.y, -1, -.15));
    for (const cheek of cheeks) c.lerp(CHEEK, .5 * Math.exp(-((d.distanceTo(cheek) / .3) ** 2)));
    headColors.push(c.r, c.g, c.b);
  }
  skull.setAttribute("color", new THREE.Float32BufferAttribute(headColors, 3)); skull.computeVertexNormals();
  add(head, skull, skin, [0, 0, 0]);

  // Eyes: glossy eyeballs that can roll, under upper and lower lids.
  const lidTop = track(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2));
  const lidBottom = track(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2));
  const eyes = [-1, 1].map(s => {
    const frame = surfaceFrame(s * .38, .03, .92);
    const socket = new THREE.Group(); socket.position.copy(frame.position); socket.quaternion.copy(frame.quaternion); socket.scale.set(1, 1.12, 1); head.add(socket);
    const globe = add(socket, ball, eyeball, [0, 0, -.05], [.082, .082, .082]);
    // The glint pokes just past the eyeball but stays under the lids when they close.
    const shine = add(globe, ball, glint, [.272, .34, .855], [.17, .17, .07]); shine.castShadow = false;
    shine.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), shine.position.clone().normalize());
    const upper = add(socket, lidTop, lid, [0, 0, -.05], [.085, .085, .085]);
    const lower = add(socket, lidBottom, lid, [0, 0, -.05], [.0845, .0845, .0845]);
    // Closed, smiling eyes: a dark arch drawn over the shut lid.
    const arch = new THREE.CatmullRomCurve3(Array.from({ length: 9 }, (_, i) => {
      const a = -.85 + i / 8 * 1.7, x = .07 * Math.sin(a), y = -.004 + .03 * Math.cos(a * 1.25);
      return new THREE.Vector3(x, y, Math.sqrt(Math.max(0, .0868 ** 2 - x * x - y * y)) - .05);
    }));
    const smiling = add(socket, track(new THREE.TubeGeometry(arch, 20, .0065, 8)), line, [0, 0, 0]); smiling.visible = false;
    return { side: s, globe, upper, lower, smiling };
  });

  // Mouth: a smile line plus an open mouth that can be round or wide.
  const mouthFrame = surfaceFrame(0, -.42, .91, .2);
  const mouth = new THREE.Group(); mouth.position.copy(mouthFrame.position); mouth.quaternion.copy(mouthFrame.quaternion); head.add(mouth);
  const smileCurve = new THREE.CatmullRomCurve3(Array.from({ length: 7 }, (_, i) => { const x = -.065 + i / 6 * .13; return new THREE.Vector3(x, .022 * (x / .065) ** 2 - .006, -x * x / .8 + .002); }));
  const smile = add(mouth, track(new THREE.TubeGeometry(smileCurve, 24, .0065, 8)), line, [0, 0, 0]);
  const opening = new THREE.Group(); mouth.add(opening);
  add(opening, ball, mouthDark, [0, 0, -.012], [1, 1, .3]);
  add(opening, ball, tongue, [0, -.42, .05], [.62, .42, .25]);

  // Stubby arms with pink pads and three brown claws.
  const claws = track(new THREE.ConeGeometry(.021, .058, 10)); claws.rotateX(Math.PI);
  const arms = [-1, 1].map(s => {
    const shoulder = new THREE.Group(); shoulder.position.set(s * .31, .68, .03); body.add(shoulder);
    add(shoulder, track(new THREE.CapsuleGeometry(.1, .16, 6, 16)), limb, [0, -.15, 0]);
    add(shoulder, ball, limb, [0, -.27, .005], [.118, .105, .108]);
    add(shoulder, ball, pad, [0, -.27, .088], [.064, .052, .024]);
    for (const dx of [-.052, 0, .052]) add(shoulder, claws, claw, [dx, -.375, .02]).rotation.set(-.15, 0, dx * 3.2);
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

  // A short tapered tail that wags: a tube whose rings shrink toward the tip.
  const tail = new THREE.Group(); tail.position.set(0, .3, -.24); body.add(tail);
  const tailCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, .02, .06), new THREE.Vector3(0, -.05, -.1), new THREE.Vector3(0, -.13, -.25), new THREE.Vector3(0, -.15, -.37), new THREE.Vector3(0, -.11, -.45)]);
  const tailShape = track(new THREE.TubeGeometry(tailCurve, 24, 1, 16));
  const tp = tailShape.getAttribute("position"), ring = new THREE.Vector3(), centre = new THREE.Vector3();
  for (let i = 0; i < tp.count; i++) {
    const t = Math.floor(i / 17) / 24, r = THREE.MathUtils.lerp(.15, .035, t ** .9);
    tailCurve.getPointAt(t, centre); ring.set(tp.getX(i), tp.getY(i), tp.getZ(i)).sub(centre).multiplyScalar(r).add(centre); tp.setXYZ(i, ring.x, ring.y, ring.z);
  }
  tailShape.computeVertexNormals();
  add(tail, tailShape, limb, [0, 0, 0]);
  add(tail, ball, limb, [0, -.11, -.45], [.036, .036, .036]);

  root.traverse(node => { if (node instanceof THREE.Mesh && node.material === glint) node.castShadow = false; });

  let mood: NailongMood = "neutral", gesture: NailongGesture = "idle";
  let reachSide = -1, reachPitch = 0, reachRoll = .15, walking = 0, walkPhase = 0, last = 0;
  let nextBlink = 2, blinkUntil = 0;
  const lookTarget = new THREE.Vector3(); let looking = false;
  const state = { open: 1, lower: 0, tilt: 0, smile: 1, mouth: 0, wide: 0, yaw: 0, pitch: 0, roll: 0, hop: 0 };
  const armState = arms.map(() => ({ x: 0, z: 0 }));
  const local = new THREE.Vector3();

  function update(time: number, reduced = false) {
    const dt = Math.min(.05, Math.max(0, time - last)); last = time;
    const ease = (from: number, to: number, speed = 10) => reduced ? to : THREE.MathUtils.damp(from, to, speed, dt);
    if (time > nextBlink) { blinkUntil = time + .13; nextBlink = time + 2.2 + Math.random() * 3.2; }
    const blink = !reduced && time < blinkUntil;
    const talking = mood === "talk" && !reduced ? .35 + .35 * Math.abs(Math.sin(time * 11)) : 0;
    const target = {
      neutral: { open: 1, lower: 0, tilt: 0, smile: 1, mouth: 0, wide: 0 },
      happy: { open: 0, lower: 0, tilt: 0, smile: 1, mouth: 0, wide: 0 },
      talk: { open: 1, lower: .1, tilt: 0, smile: .2, mouth: talking, wide: .15 },
      cheer: { open: 1.05, lower: 0, tilt: 0, smile: 0, mouth: .95, wide: .25 },
      grumpy: { open: .5, lower: .15, tilt: .42, smile: 0, mouth: .8, wide: 1 },
      surprised: { open: 1.12, lower: 0, tilt: 0, smile: 0, mouth: .8, wide: 0 },
    }[mood];
    state.open = ease(state.open, blink ? 0 : target.open, 18); state.lower = ease(state.lower, target.lower);
    state.tilt = ease(state.tilt, target.tilt); state.smile = ease(state.smile, target.smile, 14);
    state.mouth = ease(state.mouth, target.mouth, 16); state.wide = ease(state.wide, target.wide);
    for (const eye of eyes) {
      // Upper lid: tucked back when open, swung over the eyeball when closed.
      eye.upper.rotation.x = THREE.MathUtils.lerp(1.45, -1.3, THREE.MathUtils.clamp(state.open, 0, 1.2));
      eye.upper.rotation.z = eye.side * state.tilt; // inner corners down: a frown
      eye.lower.rotation.x = THREE.MathUtils.lerp(1.35, .55, state.lower);
      eye.smiling.visible = (mood === "happy" || mood === "cheer") && state.open < .25;
    }
    smile.scale.set(1, Math.max(.001, state.smile), 1); smile.visible = state.smile > .03;
    opening.visible = state.mouth > .02;
    opening.scale.set(THREE.MathUtils.lerp(.055, .095, state.wide), Math.max(.001, THREE.MathUtils.lerp(.06, .036, state.wide) * state.mouth), .1);

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
