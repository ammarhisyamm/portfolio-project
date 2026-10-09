import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createMuseumAvatar } from "./avatar";
import { createMuseumEnvironment } from "./environment";
import { createMuseumExhibits } from "./exhibits";
import { loadImage } from "./materials";
import { museumPath, type Waypoint } from "./navigation";
import type { MuseumController, MuseumData, MuseumRoom } from "./types";

type Config = {
  mount: HTMLDivElement;
  data: MuseumData;
  signal: AbortSignal;
  reducedMotion: boolean;
  onReady: () => void;
  onRoom: (room: MuseumRoom) => void;
  onFocus: (id: string | null) => void;
  onInteract: (id: string) => void;
  onPlayer: (x: number, z: number, yaw: number) => void;
  onError: () => void;
};

const destinations: Record<MuseumRoom, [number, number, number]> = {
  work: [-1.8, 1.2, 0], process: [-2, -20.3, 0], playground: [5.5, 2.5, Math.PI / 2], about: [-5.5, 2.5, -Math.PI / 2], contact: [8.2, -20.3, 0],
};
const moveKeys = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "ShiftLeft", "ShiftRight"]);

export async function createMuseumScene(config: Config): Promise<MuseumController> {
  const { mount, signal, reducedMotion: reduce } = config;
  const marbleImage = await loadImage("/museum/emperador-marble.webp");
  if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
  const mobile = window.matchMedia("(pointer: coarse)").matches || mount.clientWidth < 700;
  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.6));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-label", "Interactive 3D museum. Use WASD or the arrow keys to walk, drag to look around, and E to inspect a nearby display.");
  renderer.domElement.tabIndex = 0;
  mount.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#211b13");
  scene.fog = new THREE.FogExp2("#241d14", .016);
  const camera = new THREE.PerspectiveCamera(mobile ? 63 : 52, mount.clientWidth / mount.clientHeight, .1, 85);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  const environmentTarget = pmrem.fromScene(roomEnvironment, .04);
  scene.environment = environmentTarget.texture; scene.environmentIntensity = .45;
  roomEnvironment.dispose(); pmrem.dispose();
  const marbleMap = new THREE.Texture(marbleImage ?? undefined); marbleMap.colorSpace = THREE.SRGBColorSpace; marbleMap.needsUpdate = !!marbleImage; marbleMap.anisotropy = 4;
  const environment = createMuseumEnvironment(scene, marbleMap, mobile);
  const gallery = createMuseumExhibits(scene, config.data.exhibits, environment.marble, signal);
  const avatar = createMuseumAvatar(); scene.add(avatar.root);
  avatar.root.position.set(-1.8, 0, 1.2); avatar.root.rotation.y = Math.PI;
  const obstacles = [...environment.obstacles, ...gallery.obstacles];
  const keys = new Set<string>();
  const joystick = new THREE.Vector2();
  const velocity = new THREE.Vector3();
  const targetCamera = new THREE.Vector3(), gaze = new THREE.Vector3(), currentGaze = new THREE.Vector3();
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  let yaw = 0, pitch = .16, distance = mobile ? 6.5 : 5.8;
  let room: MuseumRoom = "work", focus: string | null = null, hovered: string | null = null;
  let paused = false, disposed = false, sprint = false, firstPerson = false;
  let dragging: { id: number; x: number; y: number; moved: number } | null = null;
  let destination: { path: Waypoint[]; yaw: number } | null = null;
  let last = performance.now(), elapsed = 0;
  const canvas = renderer.domElement;

  // Dust is decorative, finite, and paused with the scene. It is static when
  // reduced motion is requested, as are camera destinations and idle gestures.
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(mobile ? 150 : 450);
  for (let i = 0; i < dustPositions.length; i += 3) { dustPositions[i] = Math.sin(i * 12.7) * 12; dustPositions[i + 1] = 1 + ((i * 13) % 83) / 10; dustPositions[i + 2] = -29 + ((i * 11) % 40); }
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: "#d5b679", size: .026, transparent: true, opacity: .38, depthWrite: false, sizeAttenuation: true }));
  scene.add(dust);

  function collision(x: number, z: number) {
    return x < -11.2 || x > 11.2 || z < -29 || z > 11.2 || obstacles.some(obstacle => Math.abs(x - obstacle.x) < obstacle.halfX + .3 && Math.abs(z - obstacle.z) < obstacle.halfZ + .3);
  }
  function setRoom(next: MuseumRoom) { if (room !== next) { room = next; config.onRoom(next); } }
  function setFocus(id: string | null) {
    if (id === focus) return;
    focus = id; config.onFocus(id);
    gallery.displays.forEach(display => { display.frame.emissiveIntensity = display.exhibit.id === id ? .2 : 0; });
  }
  function cast(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(gallery.targets, false)[0]?.object.userData.exhibitId as string | undefined;
  }
  function releaseKeys() { keys.clear(); joystick.set(0, 0); sprint = false; dragging = null; }
  function onKeyDown(event: KeyboardEvent) {
    if (paused || event.metaKey || event.ctrlKey || event.altKey || (event.target instanceof HTMLElement && event.target.closest("input,textarea,select,[contenteditable='true'],dialog,[role='dialog']"))) return;
    if (moveKeys.has(event.code)) { event.preventDefault(); keys.add(event.code); destination = null; }
    if (event.code === "KeyE" && focus && !event.repeat) { event.preventDefault(); config.onInteract(focus); }
  }
  function onKeyUp(event: KeyboardEvent) { keys.delete(event.code); }
  function onDown(event: PointerEvent) {
    if (paused || event.button !== 0) return;
    canvas.focus({ preventScroll: true });
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: 0 };
    canvas.setPointerCapture(event.pointerId);
  }
  function onMove(event: PointerEvent) {
    if (paused) return;
    if (dragging?.id === event.pointerId) {
      const dx = event.clientX - dragging.x, dy = event.clientY - dragging.y;
      dragging.moved += Math.abs(dx) + Math.abs(dy); dragging.x = event.clientX; dragging.y = event.clientY;
      yaw -= dx * .0045; pitch = THREE.MathUtils.clamp(pitch + dy * .003, -.12, .65);
      canvas.style.cursor = "grabbing"; destination = null;
    } else if (event.pointerType === "mouse") {
      hovered = cast(event) ?? null; canvas.style.cursor = hovered ? "pointer" : "grab";
    }
  }
  function onUp(event: PointerEvent) {
    const click = dragging?.id === event.pointerId && dragging.moved < 9;
    dragging = null; canvas.style.cursor = "grab";
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (click && !paused) { const id = cast(event); if (id) config.onInteract(id); }
  }
  function onCancel() { dragging = null; canvas.style.cursor = "grab"; }
  function onWheel(event: WheelEvent) { event.preventDefault(); if (!paused) distance = THREE.MathUtils.clamp(distance + event.deltaY * .004, 3.5, 8.5); }
  function onContextLost(event: Event) { event.preventDefault(); if (!disposed) config.onError(); }
  window.addEventListener("keydown", onKeyDown); window.addEventListener("keyup", onKeyUp); window.addEventListener("blur", releaseKeys);
  canvas.addEventListener("pointerdown", onDown); canvas.addEventListener("pointermove", onMove); canvas.addEventListener("pointerup", onUp); canvas.addEventListener("pointercancel", onCancel);
  canvas.addEventListener("pointerleave", () => { hovered = null; });
  canvas.addEventListener("wheel", onWheel, { passive: false }); canvas.addEventListener("webglcontextlost", onContextLost);
  const resize = new ResizeObserver(() => {
    if (disposed || !mount.clientWidth || !mount.clientHeight) return;
    camera.aspect = mount.clientWidth / mount.clientHeight; camera.fov = camera.aspect < .9 ? 63 : 52; camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  });
  resize.observe(mount);

  function frame(now: number) {
    if (disposed) return;
    const delta = Math.min((now - last) / 1000, .045); last = now;
    if (paused || document.hidden) return;
    elapsed += delta;
    const forward = Number(keys.has("KeyW") || keys.has("ArrowUp")) - Number(keys.has("KeyS") || keys.has("ArrowDown")) - joystick.y;
    const sideways = Number(keys.has("KeyD") || keys.has("ArrowRight")) - Number(keys.has("KeyA") || keys.has("ArrowLeft")) + joystick.x;
    const running = sprint || keys.has("ShiftLeft") || keys.has("ShiftRight");
    const speed = running ? 4.8 : 2.5;
    let actualSpeed = 0;
    if (destination) {
      const waypoint = destination.path[0];
      if (waypoint) {
        const dx = waypoint.x - avatar.root.position.x, dz = waypoint.z - avatar.root.position.z, length = Math.hypot(dx, dz);
        const amount = Math.min(length, delta * 4);
        if (length > .001) { velocity.set(dx / length * 4, 0, dz / length * 4); avatar.root.position.x += dx / length * amount; avatar.root.position.z += dz / length * amount; actualSpeed = 4; }
        if (length < .06 || amount === length) destination.path.shift();
      } else {
        yaw += Math.atan2(Math.sin(destination.yaw - yaw), Math.cos(destination.yaw - yaw)) * (reduce ? 1 : 1 - Math.exp(-delta * 6));
        velocity.set(0, 0, 0);
        if (Math.abs(Math.atan2(Math.sin(destination.yaw - yaw), Math.cos(destination.yaw - yaw))) < .02) destination = null;
      }
    } else {
      const length = Math.max(1, Math.hypot(forward, sideways));
      const vx = (Math.sin(yaw) * forward + Math.cos(yaw) * sideways) / length * speed;
      const vz = (-Math.cos(yaw) * forward + Math.sin(yaw) * sideways) / length * speed;
      velocity.x = THREE.MathUtils.damp(velocity.x, vx, 14, delta); velocity.z = THREE.MathUtils.damp(velocity.z, vz, 14, delta);
      const nx = avatar.root.position.x + velocity.x * delta, nz = avatar.root.position.z + velocity.z * delta;
      if (!collision(nx, avatar.root.position.z)) avatar.root.position.x = nx;
      if (!collision(avatar.root.position.x, nz)) avatar.root.position.z = nz;
      actualSpeed = Math.hypot(velocity.x, velocity.z);
      const { x, z } = avatar.root.position;
      setRoom(z < -14 ? x > 5 ? "contact" : "process" : x < -5 ? "about" : x > 5 ? "playground" : "work");
    }
    if (actualSpeed > .08) {
      const angle = Math.atan2(velocity.x, velocity.z);
      avatar.root.rotation.y += Math.atan2(Math.sin(angle - avatar.root.rotation.y), Math.cos(angle - avatar.root.rotation.y)) * Math.min(1, delta * 12);
    }
    avatar.update(elapsed, actualSpeed, reduce);
    avatar.root.visible = !firstPerson;
    const pos = avatar.root.position;
    const side = firstPerson ? 0 : mobile ? .7 : 1.25;
    targetCamera.set(pos.x - Math.sin(yaw) * (firstPerson ? 0 : distance) + Math.cos(yaw) * side, firstPerson ? 1.95 : 2.85 + pitch * distance, pos.z + Math.cos(yaw) * (firstPerson ? 0 : distance) + Math.sin(yaw) * side);
    targetCamera.x = THREE.MathUtils.clamp(targetCamera.x, -12.9, 12.9); targetCamera.z = THREE.MathUtils.clamp(targetCamera.z, -31.7, 12.8);
    gaze.set(pos.x + Math.sin(yaw) * 5, 1.64 - pitch * 1.8, pos.z - Math.cos(yaw) * 5);
    const cameraAlpha = reduce ? 1 : 1 - Math.exp(-delta * 9);
    camera.position.lerp(targetCamera, cameraAlpha); currentGaze.lerp(gaze, cameraAlpha); camera.lookAt(currentGaze);
    let closest: string | null = null, closestDistance = 4.9;
    for (const display of gallery.displays) { const d = Math.hypot(display.position.x - pos.x, display.position.z - pos.z); if (d < closestDistance) { closestDistance = d; closest = display.exhibit.id; } }
    setFocus(hovered ?? closest);
    config.onPlayer(pos.x, pos.z, yaw);
    if (!reduce) dust.rotation.y = Math.sin(elapsed * .03) * .03;
    renderer.render(scene, camera);
  }
  targetCamera.set(avatar.root.position.x + 1.25, 3.78, avatar.root.position.z + distance);
  camera.position.copy(targetCamera); currentGaze.set(avatar.root.position.x, 1.5, avatar.root.position.z - 5); camera.lookAt(currentGaze);
  renderer.setAnimationLoop(frame);

  function dispose() {
    if (disposed) return; disposed = true;
    renderer.setAnimationLoop(null); resize.disconnect(); releaseKeys();
    window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); window.removeEventListener("blur", releaseKeys);
    canvas.removeEventListener("pointerdown", onDown); canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerup", onUp); canvas.removeEventListener("pointercancel", onCancel); canvas.removeEventListener("wheel", onWheel); canvas.removeEventListener("webglcontextlost", onContextLost);
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
    scene.traverse(object => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Sprite) {
        if ("geometry" in object) geometries.add(object.geometry);
        const list = Array.isArray(object.material) ? object.material : [object.material];
        list.forEach(material => { materials.add(material); for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value); });
      }
    });
    environment.dispose(); geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); textures.forEach(texture => texture.dispose());
    environmentTarget.dispose(); renderer.dispose(); canvas.remove(); signal.removeEventListener("abort", dispose);
  }
  signal.addEventListener("abort", dispose, { once: true });
  Promise.allSettled(gallery.loading).then(() => { if (!disposed) config.onReady(); });
  return {
    visit(next) {
      if (paused) return;
      const [x, z, direction] = destinations[next]; releaseKeys(); velocity.set(0, 0, 0);
      const path = museumPath(avatar.root.position, { x, z }, collision);
      if (reduce) { const end = path.at(-1); if (end) avatar.root.position.set(end.x, 0, end.z); yaw = direction; destination = null; }
      else destination = { path, yaw: direction };
      setRoom(next);
    },
    select(id) { if (!paused) config.onInteract(id); },
    move(x, y) { joystick.set(x, y); destination = null; },
    running(value) { sprint = value; },
    setLights(enabled) { environment.setLights(enabled); },
    setPaused(value) { paused = value; releaseKeys(); hovered = null; },
    setPerspective(value) { firstPerson = value; },
    dispose,
  };
}
