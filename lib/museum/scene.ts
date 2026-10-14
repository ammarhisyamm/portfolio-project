import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { createMuseumAvatar } from "./avatar";
import { createMuseumEnvironment } from "./environment";
import { createMuseumExhibits } from "./exhibits";
import { createStudioCat } from "./cat";
import { createNailong } from "./nailong";
import { createStudioWing, inStudio, inStudioDoor } from "./studio";
import { canvasTexture, loadImage, wrapText } from "./materials";
import { museumPath, type Waypoint } from "./navigation";
import { MUSEUM_GUIDE, type MuseumController, type MuseumData, type MuseumRoom } from "./types";

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
  work: [-4.4, -3.4, -Math.PI / 2], playground: [4.4, -3.4, Math.PI / 2], about: [-4.4, -22.6, -Math.PI / 2], process: [4.4, -22.6, Math.PI / 2], contact: [0, -23, 0], studio: [-17.2, -15, -Math.PI / 2],
};
const moveKeys = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "ShiftLeft", "ShiftRight"]);

export async function createMuseumScene(config: Config): Promise<MuseumController> {
  const { mount, signal, reducedMotion: reduce } = config;
  const [marbleImage, knitImage] = await Promise.all([
    loadImage("/museum/emperador-marble.webp"), loadImage("/museum/character-knit-v3.png"),
  ]);
  if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
  const mobile = window.matchMedia("(pointer: coarse)").matches || mount.clientWidth < 700;
  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.6));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-label", "Interactive 3D museum. Use WASD or the arrow keys to walk, drag to look around, and E to inspect a nearby display.");
  renderer.domElement.tabIndex = 0;
  mount.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#1a120b");
  scene.fog = new THREE.FogExp2("#26190e", .011);
  const camera = new THREE.PerspectiveCamera(mobile ? 63 : 52, mount.clientWidth / mount.clientHeight, .1, 85);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  const environmentTarget = pmrem.fromScene(roomEnvironment, .04);
  scene.environment = environmentTarget.texture; scene.environmentIntensity = .3;
  roomEnvironment.dispose(); pmrem.dispose();
  const marbleMap = new THREE.Texture(marbleImage ?? undefined); marbleMap.colorSpace = THREE.SRGBColorSpace; marbleMap.needsUpdate = !!marbleImage; marbleMap.anisotropy = 4;
  const environment = createMuseumEnvironment(scene, marbleMap, mobile);
  const gallery = createMuseumExhibits(scene, config.data.exhibits, environment.marble, signal);
  const studio = createStudioWing(scene, config.data.exhibits, environment.brass, mobile, signal);
  const knitMap = knitImage ? new THREE.Texture(knitImage) : undefined;
  if (knitMap) knitMap.needsUpdate = true;
  const avatar = createMuseumAvatar(knitMap); scene.add(avatar.root);
  // HDR-only bloom: readable CMS artwork stays below the threshold. Mobile
  // renders directly, avoiding the extra render targets and reflection pass.
  const composer = mobile ? null : new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 2 }));
  composer?.setSize(mount.clientWidth, mount.clientHeight);
  const renderPass = composer ? new RenderPass(scene, camera) : null;
  const bloom = composer ? new UnrealBloomPass(new THREE.Vector2(mount.clientWidth, mount.clientHeight), .3, .55, 1) : null;
  // A warm grade (amber shadows, golden highlights) and a soft vignette give
  // the halls the deep, candle-lit look of the concept frames.
  const grade = composer ? new ShaderPass({
    uniforms: { tDiffuse: { value: null }, vignette: { value: .38 } },
    vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: `uniform sampler2D tDiffuse; uniform float vignette; varying vec2 vUv;
      void main() {
        vec4 c = texture2D(tDiffuse, vUv);
        float l = dot(c.rgb, vec3(.2126, .7152, .0722));
        c.rgb *= mix(vec3(1.02, .93, .8), vec3(1.06, .99, .88), smoothstep(0., 1., l));
        vec2 d = vUv - .5;
        c.rgb *= 1. - vignette * smoothstep(.12, .62, dot(d, d) * 2.);
        gl_FragColor = c;
      }`,
  }) : null;
  const output = composer ? new OutputPass() : null;
  if (composer && renderPass && bloom && grade && output) { composer.addPass(renderPass); composer.addPass(bloom); composer.addPass(grade); composer.addPass(output); }
  // Visitors arrive just inside the doors, facing Nailong; the camera then
  // turns to the hall. With reduced motion they start facing the hall.
  avatar.root.position.set(0, 0, 6.4); avatar.root.rotation.y = reduce ? Math.PI : 0;
  const obstacles = [...environment.obstacles, ...gallery.obstacles, ...studio.obstacles];
  const cat = createStudioCat(scene, (x, z) => !inStudio(x, z) || obstacles.some(o => Math.abs(x - o.x) < o.halfX + .15 && Math.abs(z - o.z) < o.halfZ + .15));
  cat.root.scale.setScalar(.85);
  const targets = [...gallery.targets, ...studio.targets];
  // Nailong keeps the doors, greets visitors and offers directions.
  const guide = createNailong(); guide.root.scale.setScalar(1.15); guide.root.position.set(1.9, 0, 10.4); guide.root.rotation.y = Math.PI; scene.add(guide.root);
  const guideHit = new THREE.Mesh(new THREE.SphereGeometry(.8, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
  guideHit.position.y = .9; guideHit.userData.exhibitId = MUSEUM_GUIDE; guide.root.add(guideHit); targets.push(guideHit);
  obstacles.push({ x: 1.9, z: 10.4, halfX: .55, halfZ: .55 });
  const bubbles = new Map<string, THREE.Texture>();
  const bubbleText = (text: string) => {
    let texture = bubbles.get(text);
    if (!texture) {
      texture = canvasTexture(512, 208, ctx => {
        ctx.fillStyle = "#fff7e6"; ctx.strokeStyle = "#d9b77e"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.roundRect(6, 6, 500, 160, 40); ctx.moveTo(220, 164); ctx.lineTo(256, 202); ctx.lineTo(292, 164); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fff7e6"; ctx.fillRect(222, 158, 68, 10);
        ctx.fillStyle = "#3a2a17"; ctx.font = "34px Arial"; ctx.textAlign = "center"; wrapText(ctx, text, 256, 76, 440, 42, 2);
      });
      bubbles.set(text, texture);
    }
    return texture;
  };
  const bubble = new THREE.Sprite(new THREE.SpriteMaterial({ map: bubbleText("Hi there! Can I help you find something?"), transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
  // Layer 1 keeps the bubble out of the floor reflection: the reflector clones the camera
  // now, before layer 1 is enabled, so its copy only ever sees layer 0.
  bubble.scale.set(2, .81, 1); bubble.position.set(1.9, 2.62, 10.4); bubble.layers.set(1); environment.reflection?.getReflectionCamera(camera); camera.layers.enable(1); scene.add(bubble);
  let greetUntil = 0, happyUntil = 0, grumpyUntil = 0, asked = false, wasNear = false, intro = !reduce;
  const pokes: number[] = [], guideTarget = new THREE.Vector3(), bubbleView = new THREE.Vector3();
  const hasCat = config.data.exhibits.some(item => item.id === "secret-cat");
  if (hasCat) { const hit = new THREE.Mesh(new THREE.SphereGeometry(.45, 8, 6), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = .35; hit.userData.exhibitId = "secret-cat"; cat.root.add(hit); targets.push(hit); }
  const keys = new Set<string>();
  const joystick = new THREE.Vector2();
  const velocity = new THREE.Vector3();
  const targetCamera = new THREE.Vector3(), gaze = new THREE.Vector3(), currentGaze = new THREE.Vector3();
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  let yaw = reduce ? 0 : Math.PI, pitch = .09, distance = mobile ? 6.5 : 5.8;
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
    const hall = x >= -11.2 && x <= 11.2 && z >= -29 && z <= 11.2;
    return (!hall && !inStudio(x, z) && !inStudioDoor(x, z)) || obstacles.some(obstacle => Math.abs(x - obstacle.x) < obstacle.halfX + .3 && Math.abs(z - obstacle.z) < obstacle.halfZ + .3);
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
    return raycaster.intersectObjects(targets, false)[0]?.object.userData.exhibitId as string | undefined;
  }
  function releaseKeys() { keys.clear(); joystick.set(0, 0); sprint = false; dragging = null; }
  function interact(id: string) {
    // Immediate keyboard feedback; never delay the CMS dialog for choreography.
    if (!reduce) avatar.inspect(elapsed);
    if (id === "secret-cat") cat.pet(elapsed);
    if (id === MUSEUM_GUIDE) {
      // Asking once is welcome; poking Nailong three times quickly is not.
      pokes.push(elapsed); while (pokes.length && elapsed - pokes[0] > 6) pokes.shift();
      if (pokes.length >= 3) { grumpyUntil = elapsed + 2.4; pokes.length = 0; } else { happyUntil = elapsed + 1.8; asked = true; }
    }
    studio.markFound(id);
    if (composer) composer.render(0); else renderer.render(scene, camera);
    config.onInteract(id);
  }
  function onKeyDown(event: KeyboardEvent) {
    if (paused || event.metaKey || event.ctrlKey || event.altKey || (event.target instanceof HTMLElement && event.target.closest("input,textarea,select,[contenteditable='true'],dialog,[role='dialog']"))) return;
    if (moveKeys.has(event.code)) { event.preventDefault(); keys.add(event.code); destination = null; intro = false; }
    if (event.code === "KeyE" && focus && !event.repeat) { event.preventDefault(); interact(focus); }
  }
  function onKeyUp(event: KeyboardEvent) { keys.delete(event.code); }
  function onDown(event: PointerEvent) {
    if (paused || event.button !== 0) return;
    canvas.focus({ preventScroll: true }); intro = false;
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
    if (click && !paused) { const id = cast(event); if (id) interact(id); }
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
    composer?.setSize(mount.clientWidth, mount.clientHeight);
  });
  resize.observe(mount);

  function frame(now: number) {
    if (disposed) return;
    // rAF timestamps can precede the performance.now() taken at setup.
    const delta = THREE.MathUtils.clamp((now - last) / 1000, 0, .045); last = now;
    if (paused || document.hidden) return;
    elapsed += delta;
    // After a moment with Nailong, turn to face the hall (unless the visitor already took over).
    if (intro && elapsed > 3.4) { intro = false; if (!destination && !keys.size) destination = { path: [], yaw: 0 }; }
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
        // Turn the view and the visitor together, so they end up facing the same way.
        const ease = reduce ? 1 : 1 - Math.exp(-delta * 6), rotation = avatar.root.rotation, face = Math.PI - destination.yaw;
        yaw += Math.atan2(Math.sin(destination.yaw - yaw), Math.cos(destination.yaw - yaw)) * ease;
        rotation.y += Math.atan2(Math.sin(face - rotation.y), Math.cos(face - rotation.y)) * ease;
        velocity.set(0, 0, 0);
        if (Math.abs(Math.atan2(Math.sin(destination.yaw - yaw), Math.cos(destination.yaw - yaw))) < .02 && Math.abs(Math.atan2(Math.sin(face - rotation.y), Math.cos(face - rotation.y))) < .05) destination = null;
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
      setRoom(x < -12.5 ? "studio" : z < -20.5 && Math.abs(x) < 3 ? "contact" : z < -11 ? x < 0 ? "about" : "process" : x > 0 && z < 5 ? "playground" : "work");
    }
    if (actualSpeed > .08) {
      const angle = Math.atan2(velocity.x, velocity.z);
      avatar.root.rotation.y += Math.atan2(Math.sin(angle - avatar.root.rotation.y), Math.cos(angle - avatar.root.rotation.y)) * Math.min(1, delta * 12);
    }
    avatar.update(elapsed, actualSpeed, reduce, !!focus);
    environment.update(delta, reduce);
    studio.update(delta, elapsed, avatar.root.position, focus, reduce);
    cat.update(elapsed, avatar.root.position, reduce);
    const toGuide = Math.hypot(avatar.root.position.x - guide.root.position.x, avatar.root.position.z - guide.root.position.z), near = toGuide < 4.6;
    if (near && !wasNear) { greetUntil = elapsed + 2.6; asked = false; }
    wasNear = near;
    guide.lookAt(near ? guideTarget.set(avatar.root.position.x, 1.9, avatar.root.position.z) : null);
    guide.setGesture(elapsed < greetUntil || elapsed < happyUntil ? "wave" : "idle");
    guide.setMood(elapsed < grumpyUntil ? "grumpy" : elapsed < happyUntil ? "happy" : near && elapsed < greetUntil ? "talk" : "neutral");
    guide.update(elapsed, reduce);
    bubble.material.map = bubbleText(elapsed < grumpyUntil ? "Hey! That tickles." : asked ? "This way! Follow the signs." : "Hi there! Can I help you find something?");
    // Only speak into view: a bubble right beside the camera would fill the screen.
    const view = bubbleView.copy(bubble.position).project(camera);
    const speaking = near && camera.position.distanceTo(bubble.position) > 3.4 && view.z < 1 && Math.abs(view.x) < 1.15 && Math.abs(view.y) < 1.15;
    bubble.material.opacity = reduce ? Number(speaking) : THREE.MathUtils.damp(bubble.material.opacity, speaking ? 1 : 0, 6, delta);
    bubble.visible = bubble.material.opacity > .01;
    avatar.root.visible = !firstPerson;
    const pos = avatar.root.position;
    const side = firstPerson ? 0 : mobile ? .7 : 1.25;
    targetCamera.set(pos.x - Math.sin(yaw) * (firstPerson ? 0 : distance) + Math.cos(yaw) * side, firstPerson ? 1.95 : 2.85 + pitch * distance, pos.z + Math.cos(yaw) * (firstPerson ? 0 : distance) + Math.sin(yaw) * side);
    // Keep the camera inside whichever room the visitor stands in.
    if (pos.x < -14.6) {
      targetCamera.x = THREE.MathUtils.clamp(targetCamera.x, -29.7, -14.9); targetCamera.z = THREE.MathUtils.clamp(targetCamera.z, -25.4, -4.6); targetCamera.y = Math.min(targetCamera.y, 5.9);
    } else if (pos.x < -11.2) {
      targetCamera.x = THREE.MathUtils.clamp(targetCamera.x, -29.7, 12.9); targetCamera.z = THREE.MathUtils.clamp(targetCamera.z, -16.3, -13.7); targetCamera.y = Math.min(targetCamera.y, 5.2);
    } else { targetCamera.x = THREE.MathUtils.clamp(targetCamera.x, -12.9, 12.9); targetCamera.z = THREE.MathUtils.clamp(targetCamera.z, -31.7, 12.8); }
    gaze.set(pos.x + Math.sin(yaw) * 5, 2.16 - pitch * 1.8, pos.z - Math.cos(yaw) * 5);
    const cameraAlpha = reduce ? 1 : 1 - Math.exp(-delta * 9);
    camera.position.lerp(targetCamera, cameraAlpha); currentGaze.lerp(gaze, cameraAlpha); camera.lookAt(currentGaze);
    let closest: string | null = null, closestDistance = 4.9;
    for (const display of gallery.displays) { const d = Math.hypot(display.position.x - pos.x, display.position.z - pos.z); if (d < closestDistance) { closestDistance = d; closest = display.exhibit.id; } }
    // Hidden finds only answer when the visitor is right next to them.
    let secretDistance = 1.9;
    for (const secret of studio.secrets) { const d = Math.hypot(secret.position.x - pos.x, secret.position.z - pos.z); if (d < secretDistance) { secretDistance = d; closest = secret.id; } }
    if (hasCat) { const d = Math.hypot(cat.position.x - pos.x, cat.position.z - pos.z); if (d < Math.min(secretDistance, 1.7)) closest = "secret-cat"; }
    if (toGuide < 2.7) closest = MUSEUM_GUIDE;
    setFocus(hovered ?? closest);
    config.onPlayer(pos.x, pos.z, yaw);
    if (!reduce) dust.rotation.y = Math.sin(elapsed * .03) * .03;
    if (composer) composer.render(delta); else renderer.render(scene, camera);
  }
  {
    const { x, z } = avatar.root.position, side = mobile ? .7 : 1.25;
    targetCamera.set(x - Math.sin(yaw) * distance + Math.cos(yaw) * side, 2.85 + pitch * distance, z + Math.cos(yaw) * distance + Math.sin(yaw) * side);
    camera.position.copy(targetCamera); currentGaze.set(x + Math.sin(yaw) * 5, 2.16 - pitch * 1.8, z - Math.cos(yaw) * 5); camera.lookAt(currentGaze); camera.updateMatrixWorld();
  }
  renderer.setAnimationLoop(frame);

  function dispose() {
    if (disposed) return; disposed = true;
    renderer.setAnimationLoop(null); resize.disconnect(); releaseKeys();
    window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); window.removeEventListener("blur", releaseKeys);
    canvas.removeEventListener("pointerdown", onDown); canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerup", onUp); canvas.removeEventListener("pointercancel", onCancel); canvas.removeEventListener("wheel", onWheel); canvas.removeEventListener("webglcontextlost", onContextLost);
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>(), skeletons = new Set<THREE.Skeleton>();
    scene.traverse(object => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Sprite) {
        if (object instanceof THREE.SkinnedMesh) skeletons.add(object.skeleton);
        if ("geometry" in object) geometries.add(object.geometry);
        const list = Array.isArray(object.material) ? object.material : [object.material];
        list.forEach(material => { materials.add(material); for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value); });
      }
    });
    bubbles.forEach(texture => texture.dispose()); environment.dispose(); studio.dispose(); skeletons.forEach(skeleton => skeleton.dispose()); geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); textures.forEach(texture => texture.dispose());
    renderPass?.dispose(); bloom?.dispose(); grade?.dispose(); output?.dispose(); composer?.dispose();
    environmentTarget.dispose(); renderer.dispose(); canvas.remove(); signal.removeEventListener("abort", dispose);
  }
  signal.addEventListener("abort", dispose, { once: true });
  Promise.allSettled(gallery.loading).then(() => { if (!disposed) config.onReady(); });
  return {
    visit(next) {
      if (paused) return;
      const [x, z, direction] = destinations[next]; releaseKeys(); velocity.set(0, 0, 0); intro = false;
      const path = museumPath(avatar.root.position, { x, z }, collision);
      if (reduce) { const end = path.at(-1); if (end) avatar.root.position.set(end.x, 0, end.z); yaw = direction; avatar.root.rotation.y = Math.PI - direction; destination = null; }
      else destination = { path, yaw: direction };
      setRoom(next);
    },
    select(id) { if (!paused) interact(id); },
    move(x, y) { joystick.set(x, y); destination = null; },
    running(value) { sprint = value; },
    setLights(enabled) { environment.setLights(enabled); studio.setLights(enabled); },
    setPaused(value) { paused = value; releaseKeys(); hovered = null; },
    setPerspective(value) { firstPerson = value; },
    dispose,
  };
}
