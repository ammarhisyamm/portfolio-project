import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { haloTexture } from "./materials";
import { createNailong } from "./nailong";

/** Door-relative layout, in CSS pixels relative to the canvas. */
export type EntranceLayout = { width: number; height: number; door: { left: number; right: number; top: number; bottom: number }; ribbonY: number };
export type EntranceStage = ReturnType<typeof createEntranceStage>;

// The door is DOOR_HEIGHT world units tall; Nailong is sized against it.
const DOOR_HEIGHT = 2.6, SCALE = 1.1, CUT_TURN = -.12, SCISSORS = 1.45 * SCALE, ROLL = .95;
// Blade opening (degrees) over the snip, mirroring the ribbon slit timing in
// HomeEntrance: open, squeeze shut, reopen, push deeper, close through, lift.
const BLADE: [number, number, string?][] = [[0, 18, "settle"], [.16, 31], [.22, 31, "squeeze"], [.37, 3], [.41, 2, "release"], [.53, 25], [.57, 25, "squeeze"], [.76, 0], [.82, 0, "release"], [1, 14]];
// How far below the ribbon the cut point sits (world units) as the blades bite deeper.
const DEPTH: [number, number, string?][] = [[0, -.22, "settle"], [.16, -.06, "settle"], [.22, -.05, "squeeze"], [.37, -.025], [.45, -.025, "settle"], [.57, .005, "squeeze"], [.76, .02], [.84, .015, "release"], [1, -.24]];

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x: number) => {
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 18; i++) { t = (lo + hi) / 2; if (at(x1, x2, t) < x) lo = t; else hi = t; }
    return at(y1, y2, t);
  };
}
const EASE: Record<string, (x: number) => number> = { settle: bezier(.23, 1, .32, 1), squeeze: bezier(.55, 0, .8, .35), release: bezier(.2, .75, .3, 1) };
function keyframes(frames: [number, number, string?][], t: number) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 0; i < frames.length - 1; i++) {
    const [a, from, easing] = frames[i], [b, to] = frames[i + 1];
    if (t <= b) { const k = (t - a) / (b - a); return from + (to - from) * (easing ? EASE[easing](k) : k); }
  }
  return frames[frames.length - 1][1];
}

/** Giant ceremonial scissors: brushed-steel blades and brass ring handles.
 * Local space: pivot at the origin, blades point up (+y), handles down. */
function createScissors() {
  const group = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: "#d9dad6", metalness: .92, roughness: .22 });
  const brass = new THREE.MeshStandardMaterial({ color: "#d3a456", metalness: .9, roughness: .3 });
  const blade = new THREE.Shape(); blade.moveTo(0, -.02); blade.lineTo(.034, .02); blade.quadraticCurveTo(.03, .22, 0, .44); blade.quadraticCurveTo(-.006, .2, -.008, -.02); blade.closePath();
  const bladeGeometry = new THREE.ExtrudeGeometry(blade, { depth: .01, bevelEnabled: true, bevelThickness: .003, bevelSize: .003, bevelSegments: 2, curveSegments: 12 });
  const ring = new THREE.TorusGeometry(.055, .014, 10, 28), shank = new THREE.BoxGeometry(.026, .12, .016);
  const halves = [-1, 1].map(s => {
    const half = new THREE.Group(); group.add(half);
    const edge = new THREE.Mesh(bladeGeometry, steel); edge.scale.x = -s; edge.position.z = s * .007 - .005; half.add(edge);
    const arm = new THREE.Mesh(shank, brass); arm.position.set(s * .016, -.07, s * .007); arm.rotation.z = s * -.2; half.add(arm);
    const handle = new THREE.Mesh(ring, brass); handle.position.set(s * .048, -.17, s * .007); handle.scale.set(1, 1.25, 1); half.add(handle);
    return { side: s, half };
  });
  const rivet = new THREE.Mesh(new THREE.CylinderGeometry(.016, .016, .04, 16), brass); rivet.rotation.x = Math.PI / 2; group.add(rivet);
  group.traverse(node => { if (node instanceof THREE.Mesh) node.castShadow = true; });
  return {
    group,
    /** Half-angle of the blades, in radians. */
    open(angle: number) { halves.forEach(({ side, half }) => { half.rotation.z = side * angle; }); },
    dispose() { bladeGeometry.dispose(); ring.dispose(); shank.dispose(); rivet.geometry.dispose(); steel.dispose(); brass.dispose(); },
  };
}

/** A transparent WebGL layer over the entrance doors: Nailong guards the
 * ribbon, walks to the chosen spot, cuts it with giant scissors and cheers. */
export function createEntranceStage(canvas: HTMLCanvasElement, options: { reduced: boolean; onAnchor?: (x: number, y: number) => void; onSnip?: () => void }) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = .92;
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04); scene.environment = environment.texture; scene.environmentIntensity = .35; room.dispose(); pmrem.dispose();
  // Warm spotlight above the doors, a soft fill and a rim from the doorway.
  scene.add(new THREE.HemisphereLight("#fbefdc", "#2b2015", .9));
  const key = new THREE.DirectionalLight("#fff0da", 2.2); key.position.set(-.6, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight("#ffc98a", 1.6); rim.position.set(1.5, 3.5, -3); scene.add(rim);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 40);
  camera.position.set(0, 0, 10); camera.rotation.x = -.16;

  const nailong = createNailong(); nailong.root.scale.setScalar(SCALE); scene.add(nailong.root);
  const shadowMap = haloTexture();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.15, .9), new THREE.MeshBasicMaterial({ map: shadowMap, color: "#000000", transparent: true, opacity: .6, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; scene.add(shadow);
  const scissors = createScissors(); scene.add(scissors.group);
  const hand = nailong.hand(-1);

  let layout: EntranceLayout | null = null, ppu = 100, floor = 0;
  let mode: "idle" | "walk" | "snip" | "cheer" | "aside" = "idle";
  let started = 0, walkFrom = 0, walkTo = 0, walkTime = .6, targetX = 0, ribbon = 0, idleX = 0, asideX = 0, reachPitch = 0;
  let scissorsScale = 1, greetUntil = 2.4, snipped = false, frame = 0, disposed = false;
  const clock = new THREE.Timer();
  const point = new THREE.Vector3(), hit = new THREE.Vector3(), ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const handWorld = new THREE.Vector3(), up = new THREE.Quaternion();

  // Screen (CSS px) to the plane z = 0 in front of the doors.
  function toWorld(x: number, y: number, target = hit) {
    if (!layout) return target.set(0, 0, 0);
    ray.setFromCamera(new THREE.Vector2(x / layout.width * 2 - 1, -(y / layout.height) * 2 + 1), camera);
    return ray.ray.intersectPlane(plane, target) ?? target.set(0, 0, 0);
  }
  function toScreen(v: THREE.Vector3) {
    const p = v.clone().project(camera);
    return { x: (p.x + 1) / 2 * (layout?.width ?? 0), y: (1 - p.y) / 2 * (layout?.height ?? 0) };
  }
  function cutPoint(target: THREE.Vector3) {
    // Scissors stay upright in the paw; the ribbon meets the blades just above the rivet.
    hand.getWorldPosition(handWorld);
    return target.copy(handWorld).add(new THREE.Vector3(0, (.2 + .12) * SCISSORS, .06));
  }
  // Raise the paw until the cut point lands on the ribbon on screen
  // (depth below it, in world units). Returns the pitch and the cut point's
  // horizontal offset from Nailong's feet.
  function solveReach(depth: number) {
    const target = (layout?.ribbonY ?? 0) - depth * ppu;
    let lo = 0, hi = 2.95;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2; nailong.setReach(-1, mid, ROLL); nailong.poseReach(); nailong.root.updateMatrixWorld(true);
      if (toScreen(cutPoint(point)).y > target) lo = mid; else hi = mid;
    }
    const pitch = (lo + hi) / 2;
    nailong.setReach(-1, pitch, ROLL); nailong.poseReach(); nailong.root.updateMatrixWorld(true);
    return { pitch, offset: cutPoint(point).x - nailong.root.position.x };
  }

  function placeScissors() {
    nailong.root.updateMatrixWorld(true); hand.getWorldPosition(handWorld);
    scissors.group.position.copy(handWorld).add(new THREE.Vector3(0, .2 * SCISSORS, .06));
    scissors.group.quaternion.copy(up.setFromAxisAngle(new THREE.Vector3(0, 0, 1), mode === "snip" ? 0 : .25));
    scissors.group.scale.setScalar(SCISSORS * scissorsScale);
    scissors.group.visible = scissorsScale > .02;
  }

  function render(time: number) {
    if (disposed || !layout) return;
    const elapsed = time - started;
    nailong.setWalking(0);
    if (mode === "walk") {
      const k = Math.min(1, elapsed / walkTime);
      const eased = k * k * (3 - 2 * k);
      nailong.root.position.x = THREE.MathUtils.lerp(walkFrom, walkTo, eased);
      nailong.setWalking(k < 1 ? 1 : 0);
      // Raise the scissors on the way; face the ribbon again before arriving.
      nailong.setReach(-1, reachPitch * eased, .42 + (ROLL - .42) * eased);
      nailong.root.rotation.y = THREE.MathUtils.damp(nailong.root.rotation.y, k > .65 ? CUT_TURN : walkTo < walkFrom ? -.75 : .75, 10, 1 / 60);
      if (k >= 1) { mode = "snip"; started = time; nailong.setMood("neutral"); options.onSnip?.(); }
    }
    if (mode === "snip") {
      const k = Math.min(1, elapsed / 2.3);
      nailong.root.rotation.y = THREE.MathUtils.damp(nailong.root.rotation.y, CUT_TURN, 10, 1 / 60);
      nailong.root.position.x = targetX - solveReach(keyframes(DEPTH, k)).offset;
      scissors.open(THREE.MathUtils.degToRad(keyframes(BLADE, k)) * .85);
      if (k >= 1) { mode = "cheer"; started = time; }
    } else if (mode === "walk") {
      scissors.open(THREE.MathUtils.degToRad(18));
    }
    if (mode === "cheer") {
      nailong.setGesture("cheer"); nailong.setMood("cheer");
      scissorsScale = THREE.MathUtils.damp(scissorsScale, 0, 8, 1 / 60);
    }
    if (mode === "aside") {
      const k = Math.min(1, elapsed / .9);
      nailong.root.position.x = THREE.MathUtils.lerp(walkFrom, asideX, k * k * (3 - 2 * k));
      nailong.setWalking(k < 1 ? 1 : 0);
      nailong.setGesture(k < 1 ? "idle" : "wave"); nailong.setMood(k < 1 ? "happy" : "talk");
      nailong.root.rotation.y = THREE.MathUtils.damp(nailong.root.rotation.y, k < 1 ? .9 : -.45, 8, 1 / 60);
      scissorsScale = THREE.MathUtils.damp(scissorsScale, 0, 8, 1 / 60);
    }
    if (mode === "idle") {
      nailong.root.rotation.y = THREE.MathUtils.damp(nailong.root.rotation.y, -.28, 6, 1 / 60);
      const greeting = time < greetUntil && !options.reduced;
      nailong.setGesture(greeting ? "wave" : "idle"); nailong.setMood(greeting ? "talk" : "neutral");
      scissors.open(.12);
    }
    nailong.update(time, options.reduced);
    shadow.position.set(nailong.root.position.x, floor + .01, nailong.root.position.z + .05);
    placeScissors();
    renderer.render(scene, camera);
    // Anchor for the speech bubble: just above Nailong's head.
    const top = toScreen(new THREE.Vector3(nailong.root.position.x, floor + 1.62 * SCALE, nailong.root.position.z));
    options.onAnchor?.(top.x, top.y);
  }

  function loop() {
    if (disposed) return;
    clock.update(); render(clock.getElapsed());
    frame = requestAnimationFrame(loop);
  }

  const api = {
    nailong,
    layout(next: EntranceLayout) {
      layout = next;
      renderer.setSize(next.width, next.height, false);
      const doorHeight = Math.max(1, next.door.bottom - next.door.top); ppu = doorHeight / DOOR_HEIGHT;
      Object.assign(camera, { left: -next.width / 2 / ppu, right: next.width / 2 / ppu, top: next.height / 2 / ppu, bottom: -next.height / 2 / ppu });
      camera.updateProjectionMatrix(); camera.updateMatrixWorld();
      // Nailong stands on the floor a step in front of the threshold.
      floor = toWorld(next.door.left, next.door.bottom + doorHeight * .025).y;
      ribbon = toWorld(next.door.left, next.ribbonY).y;
      nailong.root.position.y = floor;
      const right = toWorld(next.door.right, next.door.bottom).x, width = right - toWorld(next.door.left, next.door.bottom).x;
      const edge = toWorld(next.width, next.door.bottom).x;
      idleX = Math.min(right + .05, edge - .55); asideX = Math.min(right + .35, edge - .5);
      if (idleX - right < -width * .2) idleX = right - width * .2;
      if (mode === "idle") nailong.root.position.x = idleX;
      if (options.reduced || !frame) render(clock.getElapsed());
    },
    /** Pointer over the ribbon (CSS px), or null when it leaves. */
    point(x: number | null) {
      if (!layout) return;
      nailong.lookAt(x === null ? null : toWorld(x, layout.ribbonY, new THREE.Vector3()).setZ(1));
      if (options.reduced) render(clock.getElapsed());
    },
    /** Walk to the chosen spot and cut. Returns the walk time in ms. */
    cut(x: number) {
      if (!layout || snipped) return 0;
      snipped = true;
      const now = clock.getElapsed();
      targetX = toWorld(x, layout.ribbonY).x;
      nailong.setGesture("reach"); nailong.setMood("happy"); nailong.lookAt(new THREE.Vector3(targetX, ribbon, 1));
      // Measure the final pose first so the walk ends exactly where the cut happens.
      const turn = nailong.root.rotation.y; nailong.root.rotation.y = CUT_TURN;
      const solved = solveReach(DEPTH[0][1]);
      nailong.root.rotation.y = turn; reachPitch = solved.pitch;
      nailong.setReach(-1, 0, .42); nailong.poseReach();
      walkFrom = nailong.root.position.x; walkTo = targetX - solved.offset;
      walkTime = THREE.MathUtils.clamp(Math.abs(walkTo - walkFrom) / 2.1, .4, 1.15);
      mode = "walk"; started = now;
      return walkTime * 1000;
    },
    stepAside() { if (mode === "aside") return; walkFrom = nailong.root.position.x; mode = "aside"; started = clock.getElapsed(); nailong.lookAt(null); },
    start() { clock.reset(); greetUntil = 2.4; if (!options.reduced) loop(); else render(0); },
    dispose() {
      disposed = true; cancelAnimationFrame(frame);
      nailong.dispose(); scissors.dispose(); shadow.geometry.dispose(); (shadow.material as THREE.Material).dispose(); shadowMap.dispose();
      environment.dispose(); renderer.dispose();
    },
  };
  return api;
}
