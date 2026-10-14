import * as THREE from "three";
import { canvasTexture } from "./materials";
import { museumPath, type Waypoint } from "./navigation";

type CatState = "walk" | "sit" | "loaf";
const SPOTS: Waypoint[] = [{ x: -28.1, z: -13.2 }, { x: -22.4, z: -18.6 }, { x: -18, z: -15.5 }, { x: -17.2, z: -21.5 }, { x: -27, z: -23 }, { x: -21, z: -8.6 }, { x: -16.4, z: -14.8 }, { x: -26.6, z: -9.6 }, { x: -19.5, z: -24 }];

/** A ginger tabby that wanders the studio, sits to watch the visitor and
 * curls up in its bed by the window. Procedural, like the rest of the scene. */
export function createStudioCat(scene: THREE.Scene, blocked: (x: number, z: number) => boolean) {
  const root = new THREE.Group(); root.name = "Studio cat"; root.position.set(-28.1, 0, -13.2); scene.add(root);
  const tabby = canvasTexture(256, 256, ctx => {
    ctx.fillStyle = "#c97a3d"; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 11; i++) { const y = 12 + i * 22 + (i % 3) * 3; ctx.fillStyle = i % 2 ? "#9a5524" : "#a85f2a"; ctx.beginPath(); ctx.moveTo(0, y); for (let x = 0; x <= 256; x += 16) ctx.lineTo(x, y + Math.sin(x * .05 + i) * 4); ctx.lineTo(256, y + 8); for (let x = 256; x >= 0; x -= 16) ctx.lineTo(x, y + 8 + Math.sin(x * .07 + i) * 3); ctx.fill(); }
  });
  const fur = new THREE.MeshStandardMaterial({ map: tabby, roughness: .95 });
  const plain = new THREE.MeshStandardMaterial({ color: "#c47538", roughness: .95 });
  const cream = new THREE.MeshStandardMaterial({ color: "#f0dcc0", roughness: .95 });
  const pink = new THREE.MeshStandardMaterial({ color: "#d48f86", roughness: .7 });
  const eye = new THREE.MeshStandardMaterial({ color: "#c8b13a", roughness: .25, emissive: "#3b3008", emissiveIntensity: .4 });
  const slit = new THREE.MeshStandardMaterial({ color: "#0b0a08", roughness: .2 });
  const dark = new THREE.MeshStandardMaterial({ color: "#2a1c14", roughness: .6 });
  const add = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, pos: [number, number, number], scale: [number, number, number] = [1, 1, 1]) => {
    const mesh = new THREE.Mesh(geometry, material); mesh.position.set(...pos); mesh.scale.set(...scale); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const ball = new THREE.SphereGeometry(1, 20, 14);
  const striped = new THREE.SphereGeometry(1, 24, 16); striped.rotateX(Math.PI / 2);

  // Hip pivot lets the whole body pitch up into a sit.
  const hips = new THREE.Group(); hips.position.set(0, .27, -.15); root.add(hips);
  add(hips, striped, fur, [0, .03, .15], [.13, .125, .27]);
  add(hips, ball, cream, [0, -.02, .22], [.09, .08, .16]);
  add(hips, striped, fur, [0, .02, -.01], [.135, .13, .13]);
  add(hips, striped, fur, [0, .07, .3], [.115, .13, .12]);
  const head = new THREE.Group(); head.position.set(0, .2, .42); hips.add(head);
  add(head, ball, fur, [0, 0, 0], [.11, .1, .1]);
  add(head, ball, cream, [0, -.035, .07], [.055, .04, .045]);
  add(head, ball, pink, [0, -.012, .108], [.012, .008, .008]);
  for (const s of [-1, 1]) {
    const ear = add(head, new THREE.ConeGeometry(.045, .085, 4), plain, [s * .06, .09, -.005]); ear.rotation.set(-.15, Math.PI / 4, s * -.32);
    const inner = add(head, new THREE.ConeGeometry(.028, .055, 4), pink, [s * .058, .085, .01]); inner.rotation.set(-.15, Math.PI / 4, s * -.32);
    add(head, ball, eye, [s * .043, .018, .082], [.02, .018, .012]);
    add(head, ball, slit, [s * .043, .018, .092], [.004, .014, .004]);
    add(head, ball, cream, [s * .028, -.035, .095], [.03, .025, .02]);
    for (const tilt of [-.12, 0, .12]) {
      const whisker = add(head, new THREE.CylinderGeometry(.0012, .0008, .12, 3), cream, [s * .08, -.03 + tilt * .08, .09]);
      whisker.rotation.set(0, s * .2, Math.PI / 2 + tilt * s);
    }
  }
  add(head, ball, dark, [0, .07, .06], [.012, .03, .006]).rotation.x = -.6;
  // Four legs (shoulder / hip pivots) with cream paws.
  const legs: THREE.Group[] = [];
  for (const [x, z, front] of [[-.065, .3, 1], [.065, .3, 1], [-.07, 0, 0], [.07, 0, 0]] as [number, number, number][]) {
    const pivot = new THREE.Group(); pivot.position.set(x, front ? .02 : 0, z); hips.add(pivot);
    add(pivot, new THREE.CapsuleGeometry(front ? .028 : .036, .15, 4, 10), front ? plain : fur, [0, -.12, 0]);
    add(pivot, ball, cream, [0, -.25, .015], [.032, .02, .042]);
    legs.push(pivot);
  }
  // Tail: a chain of tapering segments so it can curl and sway.
  const tail: THREE.Group[] = [];
  let parent: THREE.Object3D = hips, tailZ = -.12;
  for (let i = 0; i < 9; i++) {
    const segment = new THREE.Group(); segment.position.set(0, i ? 0 : .06, i ? -.046 : tailZ); parent.add(segment);
    const radius = .028 - i * .0018;
    const piece = add(segment, new THREE.CapsuleGeometry(radius, .03, 3, 8), i === 8 ? dark : i % 2 ? plain : fur, [0, 0, -.023]); piece.rotation.x = Math.PI / 2;
    segment.rotation.x = i ? -.14 : .9;
    tail.push(segment); parent = segment; tailZ = 0;
  }
  // Little hearts when the cat is petted.
  const heartMap = canvasTexture(64, 64, ctx => { ctx.fillStyle = "#ff8f8f"; ctx.font = "48px Georgia"; ctx.textAlign = "center"; ctx.fillText("♥", 32, 48); });
  const hearts = Array.from({ length: 4 }, () => { const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartMap, transparent: true, opacity: 0, depthWrite: false })); sprite.scale.setScalar(.14); scene.add(sprite); return sprite; });

  let state: CatState = "loaf", timer = 6, path: Waypoint[] = [], phase = 0, sit = 1, loaf = 1, purrUntil = -1, purrStart = 0;
  let bodyYaw = 0, last = 0;
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
    pet(time: number) { purrStart = time; purrUntil = time + 2.4; state = "sit"; timer = 4; path = []; },
    update(time: number, player: THREE.Vector3, reduced: boolean) {
      const dt = Math.min(.05, Math.max(0, time - last)); last = time;
      const toPlayer = Math.hypot(player.x - root.position.x, player.z - root.position.z);
      const watching = toPlayer < 2.6 && state !== "loaf";
      timer -= dt;
      if (state === "walk") {
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
      const yaw = watching || time < purrUntil ? Math.atan2(player.x - root.position.x, player.z - root.position.z) : bodyYaw;
      const turn = Math.atan2(Math.sin(yaw - root.rotation.y), Math.cos(yaw - root.rotation.y));
      root.rotation.y += reduced ? turn : turn * Math.min(1, dt * (state === "walk" ? 8 : 4));
      if (state === "walk") bodyYaw = root.rotation.y;
      sit = reduced ? Number(state === "sit") : THREE.MathUtils.damp(sit, state === "sit" ? 1 : 0, 6, dt);
      loaf = reduced ? Number(state === "loaf") : THREE.MathUtils.damp(loaf, state === "loaf" ? 1 : 0, 4, dt);
      const walking = state === "walk" ? 1 : 0;
      hips.rotation.x = -.5 * sit; hips.position.y = .27 - .12 * loaf + Math.abs(Math.sin(phase)) * .008 * walking;
      legs.forEach((leg, i) => {
        const front = i < 2, swing = reduced ? 0 : Math.sin(phase + (i === 0 || i === 3 ? 0 : Math.PI)) * .5 * walking;
        leg.rotation.x = swing + (front ? .5 * sit : -1.25 * sit) - (front ? 1.35 : -1.35) * loaf * (front ? 1 : .6);
        leg.scale.y = 1 - .45 * loaf;
      });
      head.rotation.x = .48 * sit + .25 * loaf;
      head.rotation.y = watching && !reduced ? THREE.MathUtils.clamp(Math.sin(time * .7) * .15, -.3, .3) : 0;
      const purring = time < purrUntil;
      tail.forEach((segment, i) => {
        // Base lifts the tail; each link curls it. Upright and quivering when purring,
        // low and wrapped around the body when loafing.
        if (!i) { segment.rotation.x = .55 + (purring ? .6 : 0) - loaf * .55 - sit * .45; segment.rotation.y = loaf * 1.2; return; }
        const sway = reduced ? 0 : Math.sin(time * (purring ? 5 : 1.6) - i * .55) * (purring ? .1 : .12);
        segment.rotation.x = (purring ? .02 : -.1) * (1 - loaf);
        segment.rotation.y = sway + loaf * .32;
      });
      hearts.forEach((heart, i) => {
        const t = (time - purrStart - i * .35) / 1.4, alive = purring && t > 0 && t < 1 && !reduced;
        heart.material.opacity = alive ? Math.sin(Math.PI * t) : 0;
        heart.position.set(root.position.x + Math.sin(i * 2.1) * .12, .7 + t * .45, root.position.z + Math.cos(i * 2.1) * .12);
      });
    },
  };
}
