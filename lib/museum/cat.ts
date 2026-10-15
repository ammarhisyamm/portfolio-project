import * as THREE from "three";
import { canvasTexture } from "./materials";
import { museumPath, type Waypoint } from "./navigation";

type CatState = "walk" | "sit" | "loaf";
const SPOTS: Waypoint[] = [{ x: -28.1, z: -13.2 }, { x: -22.4, z: -18.6 }, { x: -18, z: -15.5 }, { x: -17.2, z: -21.5 }, { x: -27, z: -23 }, { x: -21, z: -8.6 }, { x: -16.4, z: -14.8 }, { x: -26.6, z: -9.6 }, { x: -19.5, z: -24 }];

// Ginger tabby coat: warm orange with darker mackerel stripes across the
// back and legs, a paler belly, white chest, muzzle and socks.
const GINGER = new THREE.Color("#d7863d"), LIGHT = new THREE.Color("#eaa45e"), STRIPE = new THREE.Color("#9f531d");
const UNDER = new THREE.Color("#f0c592"), WHITE = new THREE.Color("#f7f1e8"), TIP = new THREE.Color("#6a3517");
const smooth = THREE.MathUtils.smoothstep;
// The hip pivot: the body pitches up around it to sit.
const PIVOT = new THREE.Vector3(0, .27, -.15);

/** Body cross-sections from rump (z -.3) to chest (z .28): half height,
 * half width and centre height, sampled evenly along the spine. */
const BODY: [number, number, number][] = [[.075, .07, .3], [.108, .092, .296], [.118, .1, .29], [.11, .094, .285], [.102, .088, .284], [.104, .088, .287], [.112, .09, .295], [.118, .088, .306], [.1, .074, .322]];
function bodySection(t: number) {
  const f = t * (BODY.length - 1), i = Math.min(BODY.length - 2, Math.floor(f)), k = f - i;
  const p = (j: number) => BODY[THREE.MathUtils.clamp(j, 0, BODY.length - 1)];
  // Catmull-Rom through the samples keeps the silhouette smooth.
  return [0, 1, 2].map(c => {
    const a = p(i - 1)[c], b = p(i)[c], d = p(i + 1)[c], e = p(i + 2)[c];
    return .5 * (2 * b + (-a + d) * k + (2 * a - 5 * b + 4 * d - e) * k * k + (-a + 3 * b - 3 * d + e) * k * k * k);
  });
}

function colorize(geometry: THREE.BufferGeometry, paint: (p: THREE.Vector3, i: number) => THREE.Color) {
  const position = geometry.getAttribute("position"), colors: number[] = [], p = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) { const c = paint(p.fromBufferAttribute(position, i), i); colors.push(c.r, c.g, c.b); }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}
const coat = (stripe: number, under = 0, white = 0, light = 0) => GINGER.clone().lerp(LIGHT, light).lerp(STRIPE, stripe).lerp(UNDER, under).lerp(WHITE, white);

/** A tube along a curve whose radius follows `radius(t)`. */
function taperedTube(points: THREE.Vector3[], radius: (t: number) => number, segments = 24) {
  const curve = new THREE.CatmullRomCurve3(points), g = new THREE.TubeGeometry(curve, segments, 1, 12, false);
  const position = g.getAttribute("position"), centre = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    const t = Math.floor(i / 13) / segments; curve.getPointAt(t, centre);
    v.fromBufferAttribute(position, i).sub(centre).multiplyScalar(radius(t)).add(centre); position.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return { geometry: g, curve };
}

/** A ginger tabby that wanders the studio, sits to watch the visitor and
 * curls up in its bed by the window. Procedural, like the rest of the scene. */
export function createStudioCat(scene: THREE.Scene, blocked: (x: number, z: number) => boolean) {
  const root = new THREE.Group(); root.name = "Studio cat"; root.position.set(-28.1, 0, -13.2); scene.add(root);
  const fur = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .92 });
  const pink = new THREE.MeshStandardMaterial({ color: "#d9928a", roughness: .7 });
  const eyeMap = canvasTexture(128, 64, ctx => {
    // Equirect map: the front of the eyeball sits at u = .25, v = .5.
    ctx.fillStyle = "#e9e2cf"; ctx.fillRect(0, 0, 128, 64);
    const iris = ctx.createRadialGradient(32, 32, 2, 32, 32, 24);
    iris.addColorStop(0, "#d8c046"); iris.addColorStop(.6, "#c39a2a"); iris.addColorStop(.92, "#8a6a1c"); iris.addColorStop(1, "#3d2e0e");
    ctx.fillStyle = iris; ctx.beginPath(); ctx.arc(32, 32, 24, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#070503"; ctx.beginPath(); ctx.ellipse(32, 32, 3.2, 17, 0, 0, Math.PI * 2); ctx.fill();
  });
  const eye = new THREE.MeshPhysicalMaterial({ map: eyeMap, roughness: .15, clearcoat: 1, clearcoatRoughness: .05 });
  const nose = new THREE.MeshStandardMaterial({ color: "#c97b78", roughness: .5 });
  const whiskerMat = new THREE.MeshBasicMaterial({ color: "#f3eee6", transparent: true, opacity: .75 });
  const add = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, pos: [number, number, number] | THREE.Vector3, scale: [number, number, number] = [1, 1, 1]) => {
    const mesh = new THREE.Mesh(geometry, material);
    if (pos instanceof THREE.Vector3) mesh.position.copy(pos); else mesh.position.set(...pos);
    mesh.scale.set(...scale); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };

  const hips = new THREE.Group(); hips.position.copy(PIVOT); root.add(hips);
  // Body: one smooth loaf from rump to chest, striped across the back.
  {
    const g = new THREE.SphereGeometry(1, 56, 40); g.rotateX(Math.PI / 2);
    const position = g.getAttribute("position"), v = new THREE.Vector3();
    const look: { up: number; side: number; z: number }[] = [];
    for (let i = 0; i < position.count; i++) {
      v.fromBufferAttribute(position, i);
      const t = (v.z + 1) / 2, rho = Math.hypot(v.x, v.y), ux = rho > 1e-6 ? v.x / rho : 0, uy = rho > 1e-6 ? v.y / rho : 0;
      const [h, w, cy] = bodySection(t), round = Math.sqrt(Math.max(0, 1 - Math.abs(v.z) ** 6)), z = THREE.MathUtils.lerp(-.3, .28, t);
      const sag = uy < 0 ? 1 + .06 * Math.sin(t * Math.PI) : 1;
      position.setXYZ(i, ux * w * round, cy + uy * h * round * sag, z);
      look.push({ up: uy * round + (1 - round) * .2, side: ux, z });
    }
    g.computeVertexNormals();
    colorize(g, (p, i) => {
      const { up, side, z } = look[i];
      const wave = Math.sin(z * 92 + 1.6 * Math.sin(side * 2.4 + z * 11) + (up < 0 ? 0 : .6 * up));
      const fine = Math.sin(z * 190 + 2 * Math.sin(side * 3 + z * 17));
      const stripe = (smooth(wave, .4, .85) * .85 + smooth(fine, .7, .95) * .3) * smooth(up, -.6, -.05) + .35 * smooth(up, .8, .98);
      const chest = smooth(z, .12, .25) * smooth(-up, -.35, .4);
      return coat(stripe, smooth(-up, .3, .85) * .8, chest, smooth(up, -.2, .5) * .3);
    });
    g.translate(-PIVOT.x, -PIVOT.y, -PIVOT.z);
    add(hips, g, fur, [0, 0, 0]);
  }
  // Neck, then a head with full cheeks, a short muzzle and big ears.
  {
    const g = colorize(new THREE.SphereGeometry(1, 24, 18), p => coat(.15 * smooth(p.y, .3, .9), 0, smooth(p.z, -.1, .6) * smooth(-p.y, -.4, .3)));
    add(hips, g, fur, new THREE.Vector3(0, .36, .235).sub(PIVOT), [.066, .082, .085]).rotation.x = -.5;
  }
  const head = new THREE.Group(); head.position.copy(new THREE.Vector3(0, .415, .3).sub(PIVOT)); head.scale.setScalar(1.14); hips.add(head);
  {
    const g = new THREE.SphereGeometry(1, 48, 36), position = g.getAttribute("position"), d = new THREE.Vector3();
    const look: THREE.Vector3[] = [];
    for (let i = 0; i < position.count; i++) {
      d.fromBufferAttribute(position, i).normalize(); look.push(d.clone());
      const front = Math.max(0, d.z), low = smooth(-d.y, -.2, .6);
      const cheek = 1 + .16 * low * smooth(Math.abs(d.x), .3, .8);
      const muzzle = .016 * Math.exp(-((d.x / .5) ** 2 + ((d.y + .38) / .3) ** 2)) * front ** 2;
      const chin = .006 * Math.exp(-((d.x / .3) ** 2 + ((d.y + .75) / .2) ** 2)) * front;
      position.setXYZ(i, d.x * .074 * cheek, d.y * .066 - .004 * Math.max(0, d.y) ** 3, d.z * .068 + (muzzle + chin) * Math.sign(d.z + 1e-6));
    }
    g.computeVertexNormals();
    colorize(g, (_, i) => {
      const n = look[i], front = Math.max(0, n.z);
      const muzzle = smooth(front, .55, .8) * smooth(-n.y, .05, .3) * (1 - smooth(Math.abs(n.x), .45, .6)) + smooth(-n.y, .55, .8) * smooth(front, .1, .4);
      const brow = smooth(Math.sin(n.x * 34), .55, .95) * smooth(n.y, .3, .6) * smooth(front, .2, .6);
      const cheekLines = smooth(Math.sin(n.y * 30 + 1), .6, .95) * smooth(Math.abs(n.x), .6, .85) * smooth(-n.y, -.3, .1) * smooth(.9, .3, front + .3);
      const crown = smooth(Math.sin(n.x * 18), .5, .95) * smooth(n.y, .5, .8) * (1 - front);
      return coat(Math.max(brow, cheekLines * .8, crown * .7), 0, muzzle, .25);
    });
    add(head, g, fur, [0, 0, 0]);
  }
  const ears: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    // Ears: tall rounded triangles with pink insides, tipped slightly out.
    const ear = new THREE.Group(); ear.position.set(s * .042, .05, -.006); ear.rotation.set(-.12, s * -.35, s * -.3); ear.userData.side = s; head.add(ear); ears.push(ear);
    const outer = colorize(new THREE.ConeGeometry(1, 1, 16), p => coat(.2, 0, 0, .1).lerp(STRIPE, smooth(p.y, .2, .5) * .25));
    add(ear, outer, fur, [0, .028, 0], [.036, .062, .015]);
    add(ear, new THREE.ConeGeometry(1, 1, 12), pink, [0, .022, .009], [.023, .044, .006]);
    // Eyes: amber with slit pupils, set into the face.
    const eyeball = add(head, new THREE.SphereGeometry(1, 20, 14), eye, [s * .031, .013, .051], [.0155, .0135, .0155]);
    eyeball.rotation.y = s * .32;
    add(head, new THREE.SphereGeometry(1, 8, 6), whiskerMat, [s * .027, .019, .065], [.003, .003, .001]).castShadow = false;
    // Whiskers fanning from the muzzle.
    for (const tilt of [-.1, 0, .1]) {
      const w = add(head, new THREE.CylinderGeometry(.0007, .0004, .11, 3), whiskerMat, [s * .07, -.025 + tilt * .06, .064]);
      w.rotation.set(0, s * .25, Math.PI / 2 + tilt * s); w.castShadow = false;
    }
  }
  add(head, new THREE.SphereGeometry(1, 12, 8), nose, [0, -.012, .084], [.011, .007, .007]);
  add(head, new THREE.TorusGeometry(.008, .0012, 4, 12, Math.PI), new THREE.MeshStandardMaterial({ color: "#5a3424" }), [0, -.03, .079]).rotation.z = Math.PI;

  // Legs: slim striped front legs, strong bent hind legs, white socks.
  const legs: THREE.Group[] = [], haunches: THREE.Mesh[] = [];
  const legMesh = (parent: THREE.Object3D, points: THREE.Vector3[], radius: (t: number) => number, sock: number) => {
    const { geometry } = taperedTube(points, radius);
    colorize(geometry, p => coat(smooth(Math.sin(p.y * 70), .55, .9) * .7 * smooth(p.y, -.2, -.1), 0, smooth(-p.y, sock - .02, sock + .01)));
    add(parent, geometry, fur, [0, 0, 0]);
    const end = points[points.length - 1];
    add(parent, colorize(new THREE.SphereGeometry(1, 16, 10), () => WHITE.clone()), fur, [end.x, end.y + .005, end.z + .014], [.026, .017, .034]);
  };
  for (const [x, z, front] of [[-.05, .17, 1], [.05, .17, 1], [-.058, -.18, 0], [.058, -.18, 0]] as [number, number, number][]) {
    const pivot = new THREE.Group(); pivot.position.copy(new THREE.Vector3(x, .28, z).sub(PIVOT)); hips.add(pivot);
    if (front) legMesh(pivot, [new THREE.Vector3(0, .02, -.005), new THREE.Vector3(0, -.06, .005), new THREE.Vector3(0, -.18, .0), new THREE.Vector3(0, -.258, .008)], t => THREE.MathUtils.lerp(.036, .019, t ** .6), .21);
    else {
      // The haunch: a rounded thigh blending into the hip, fuller when sitting.
      const haunch = add(hips, colorize(new THREE.SphereGeometry(1, 24, 16), p => coat(smooth(Math.sin(p.y * 9 + p.z * 4), .4, .9) * .7, smooth(-p.y, .2, .9) * .5)), fur, pivot.position.clone().add(new THREE.Vector3(-Math.sign(x) * .01, -.03, .01)), [.05, .078, .08]);
      haunch.rotation.x = .3; haunches.push(haunch);
      legMesh(pivot, [new THREE.Vector3(0, .0, .015), new THREE.Vector3(0, -.08, .045), new THREE.Vector3(0, -.15, .0), new THREE.Vector3(0, -.215, -.035), new THREE.Vector3(0, -.268, -.015)], t => THREE.MathUtils.lerp(.042, .019, t ** .55), .21);
    }
    legs.push(pivot);
  }
  // Tail: a chain of tapering striped links ending in a dark tip, so it can curl and sway.
  const tail: THREE.Group[] = [];
  let parent: THREE.Object3D = hips;
  for (let i = 0; i < 10; i++) {
    const segment = new THREE.Group(); segment.position.copy(i ? new THREE.Vector3(0, 0, -.043) : new THREE.Vector3(0, .32, -.28).sub(PIVOT)); parent.add(segment);
    const r0 = .028 - i * .0013, link = new THREE.CapsuleGeometry(r0, .028, 4, 10); link.rotateX(Math.PI / 2); link.translate(0, 0, -.021);
    colorize(link, p => coat(smooth(Math.sin((p.z - i * .043) * 140), .2, .7) * .85, 0, 0, .2).lerp(TIP, smooth(i - (p.z + .021) * 23, 7.5, 9.2)));
    add(segment, link, fur, [0, 0, 0]);
    tail.push(segment); parent = segment;
  }
  // Little hearts when the cat is petted.
  const heartMap = canvasTexture(64, 64, ctx => { ctx.fillStyle = "#ff8f8f"; ctx.font = "48px Georgia"; ctx.textAlign = "center"; ctx.fillText("♥", 32, 48); });
  const hearts = Array.from({ length: 4 }, () => { const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartMap, transparent: true, opacity: 0, depthWrite: false })); sprite.scale.setScalar(.14); scene.add(sprite); return sprite; });

  // A puff of steam over the head when it has been poked too often.
  const angerMap = canvasTexture(64, 64, ctx => { ctx.strokeStyle = "#ff4b2e"; ctx.lineWidth = 6; ctx.lineCap = "round"; for (const [x, y, a] of [[6, 6, 0], [58, 6, Math.PI / 2], [58, 58, Math.PI], [6, 58, Math.PI * 1.5]]) { ctx.beginPath(); ctx.arc(x, y, 21, a + .2, a + Math.PI / 2 - .2); ctx.stroke(); } });
  const anger = new THREE.Sprite(new THREE.SpriteMaterial({ map: angerMap, transparent: true, opacity: 0, depthWrite: false })); anger.scale.setScalar(.16); scene.add(anger);

  let state: CatState = "loaf", timer = 6, path: Waypoint[] = [], phase = 0, sit = 1, loaf = 1, purrUntil = -1, purrStart = 0, angryUntil = -1, angryStart = 0, angry = 0;
  let bodyYaw = 0, last = 0, held: CatState | null = null;
  const pick = () => {
    const here = { x: root.position.x, z: root.position.z };
    for (let tries = 0; tries < 4; tries++) {
      const target = SPOTS[Math.floor(Math.random() * SPOTS.length)];
      if (Math.hypot(target.x - here.x, target.z - here.z) < 2) continue;
      const route = museumPath(here, target, blocked);
      if (route.length) return route;
    }
    return [];
  };
  return {
    root,
    position: root.position,
    pet(time: number) { purrStart = time; purrUntil = time + 2.4; angryUntil = -1; state = "sit"; timer = 4; path = []; },
    /** Poked too often: stands up with an arched back, ears flat, tail puffed. */
    anger(time: number) { angryStart = time; angryUntil = time + 2.6; purrUntil = -1; state = "sit"; timer = 5; path = []; },
    /** Pin the cat in one pose (for previews); null lets it roam again. */
    hold(next: CatState | null) { held = next; if (next) state = next; },
    update(time: number, player: THREE.Vector3, reduced: boolean) {
      const dt = Math.min(.05, Math.max(0, time - last)); last = time;
      const toPlayer = Math.hypot(player.x - root.position.x, player.z - root.position.z);
      const watching = toPlayer < 2.6 && state !== "loaf" && !held;
      timer -= dt;
      if (held) { if (held === "walk") phase += dt * 9; }
      else if (state === "walk") {
        const next = path[0];
        if (!next || watching) { state = "sit"; timer = 3 + Math.random() * 4; path = []; }
        else {
          const dx = next.x - root.position.x, dz = next.z - root.position.z, length = Math.hypot(dx, dz), step = Math.min(length, dt * .75);
          if (length > .001) { root.position.x += dx / length * step; root.position.z += dz / length * step; bodyYaw = Math.atan2(dx, dz); }
          if (length < .05) path.shift();
          phase += dt * 9;
        }
      } else if (timer <= 0 && !watching) {
        const nearBed = Math.hypot(root.position.x + 28.1, root.position.z + 13.2) < .4;
        if (state === "sit" && nearBed && Math.random() < .5) { state = "loaf"; timer = 10 + Math.random() * 10; }
        else { path = pick(); state = path.length ? "walk" : "sit"; timer = 4; }
      }
      // Face the visitor while watching; otherwise face the direction of travel.
      if (!held) {
        const yaw = watching || time < purrUntil ? Math.atan2(player.x - root.position.x, player.z - root.position.z) : bodyYaw;
        const turn = Math.atan2(Math.sin(yaw - root.rotation.y), Math.cos(yaw - root.rotation.y));
        root.rotation.y += reduced ? turn : turn * Math.min(1, dt * (state === "walk" ? 8 : 4));
        if (state === "walk") bodyYaw = root.rotation.y;
      }
      const cross = time < angryUntil;
      angry = reduced ? Number(cross) : THREE.MathUtils.damp(angry, cross ? 1 : 0, 9, dt);
      const sitting = state === "sit" && !cross;
      sit = reduced ? Number(sitting) : THREE.MathUtils.damp(sit, sitting ? 1 : 0, 6, dt);
      loaf = reduced ? Number(state === "loaf") : THREE.MathUtils.damp(loaf, state === "loaf" ? 1 : 0, 4, dt);
      const walking = state === "walk" ? 1 : 0;
      // Sitting drops the rump to the floor and lifts the chest; loafing lowers everything.
      hips.rotation.x = -.95 * sit;
      hips.position.y = PIVOT.y - .19 * sit - .15 * loaf + Math.abs(Math.sin(phase)) * .008 * walking + .035 * angry;
      // Bristling: the whole cat shivers a little and the back arches up.
      hips.rotation.z = reduced ? 0 : Math.sin(time * 38) * .012 * angry;
      legs.forEach((leg, i) => {
        const front = i < 2, swing = reduced ? 0 : Math.sin(phase + (i === 0 || i === 3 ? 0 : Math.PI)) * .45 * walking;
        leg.rotation.x = swing + (front ? .95 * sit : -.3 * sit) - (front ? 1.35 : 1.25) * loaf;
        leg.scale.y = 1 - .4 * loaf - (front ? 0 : .25 * sit);
      });
      haunches.forEach(h => h.scale.set(.05 + .025 * sit + .02 * loaf, .078 + .03 * sit, .08 + .035 * sit));
      head.rotation.x = .85 * sit + .22 * loaf - .08 * walking + .25 * angry;
      ears.forEach(ear => ear.rotation.set(-.12 - .7 * angry, ear.userData.side * (-.35 - .5 * angry), ear.userData.side * (-.3 - .9 * angry)));
      head.rotation.y = watching && !reduced ? THREE.MathUtils.clamp(Math.sin(time * .7) * .15, -.3, .3) : 0;
      const purring = time < purrUntil;
      tail.forEach((segment, i) => {
        // Base lifts the tail; each link curls it. Up and quivering when purring,
        // low along the floor when sitting, wrapped round the body when loafing.
        if (!i) { segment.scale.setScalar(1 + .35 * angry); segment.rotation.x = .62 + (purring ? .6 : 0) - loaf * .62 + sit * .2 + .75 * angry; segment.rotation.y = (loaf * 1.2 + sit * .45) * (1 - angry); return; }
        const sway = reduced ? 0 : Math.sin(time * (purring ? 5 : 1.6) - i * .55) * (purring ? .1 : .1);
        segment.rotation.x = (purring ? .02 : -.07) * (1 - loaf) - sit * .02;
        segment.rotation.y = (sway + loaf * .32 + sit * .16) * (1 - angry);
        segment.rotation.x = THREE.MathUtils.lerp(segment.rotation.x, .05, angry);
      });
      const steam = (time - angryStart) / 2.4;
      anger.material.opacity = cross && !reduced ? Math.min(1, steam * 6) * (1 - Math.max(0, steam - .7) / .3) : reduced && cross ? 1 : 0;
      anger.position.set(root.position.x + Math.sin(root.rotation.y) * .2, .74 + Math.sin(time * 14) * .01, root.position.z + Math.cos(root.rotation.y) * .2);
      hearts.forEach((heart, i) => {
        const t = (time - purrStart - i * .35) / 1.4, alive = purring && t > 0 && t < 1 && !reduced;
        heart.material.opacity = alive ? Math.sin(Math.PI * t) : 0;
        heart.position.set(root.position.x + Math.sin(i * 2.1) * .12, .7 + t * .45, root.position.z + Math.cos(i * 2.1) * .12);
      });
    },
  };
}
