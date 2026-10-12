import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.domElement.setAttribute("aria-label", "Interactive character preview; drag to orbit and use the buttons to inspect animations.");
document.body.prepend(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color("#222326");
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, .01, 50);
camera.position.set(2.5, 1.8, 4.1);
const orbit = new OrbitControls(camera, renderer.domElement); orbit.target.set(0, 1.17, 0);
orbit.enableDamping = !reduce; orbit.minDistance = .42; orbit.maxDistance = 8; orbit.maxPolarAngle = Math.PI * .58;
const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
const env = pmrem.fromScene(room); scene.environment = env.texture; scene.environmentIntensity = .45; room.dispose(); pmrem.dispose();
scene.add(new THREE.HemisphereLight("#dce5ed", "#64605a", .8));
const key = new THREE.DirectionalLight("#ffe6ce", 2.2); key.position.set(3, 5, 4); key.castShadow = true;
key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = key.shadow.camera.bottom = -3; key.shadow.camera.right = key.shadow.camera.top = 3;
key.shadow.normalBias = .018; scene.add(key);
const fill = new THREE.DirectionalLight("#c9d9ef", 1.2); fill.position.set(-4, 3, 1); scene.add(fill);
const rim = new THREE.DirectionalLight("#ffdcaf", 2.2); rim.position.set(-2, 4, -3); scene.add(rim);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: "#333336", roughness: .95 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -.013; ground.receiveShadow = true; scene.add(ground);
let mixer: THREE.AnimationMixer | undefined, previous: THREE.AnimationAction | undefined;
const actions = new Map<string, THREE.AnimationAction>();
const clock = new THREE.Timer();
new GLTFLoader().load("/museum/hisyam-character-v3.glb", gltf => {
  scene.add(gltf.scene); gltf.scene.traverse(node => { if (node instanceof THREE.Mesh) { node.castShadow = node.receiveShadow = true; if (node instanceof THREE.SkinnedMesh) node.frustumCulled = false; } });
  mixer = new THREE.AnimationMixer(gltf.scene);
  for (const clip of gltf.animations) actions.set(clip.name, mixer.clipAction(clip));
  previous = actions.get("Idle"); previous?.play(); if (reduce) mixer.timeScale = 0;
  document.getElementById("status")!.textContent = "Model ready · v3";
}, undefined, () => { document.getElementById("status")!.textContent = "Could not load the model. Please reload."; });
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-clip]")) button.addEventListener("click", () => {
  const action = actions.get(button.dataset.clip!); if (!action) return;
  previous?.fadeOut(reduce ? 0 : .18); action.reset().fadeIn(reduce ? 0 : .18).play(); previous = action;
  if (reduce) { action.time = action.getClip().duration * .25; mixer?.update(0); }
  document.querySelectorAll("[data-clip]").forEach(node => node.setAttribute("aria-pressed", String(node === button)));
});
document.getElementById("face")!.addEventListener("click", () => { orbit.target.set(0, 2.04, .02); camera.position.set(.35, 2.09, .77); orbit.update(); });
document.getElementById("full")!.addEventListener("click", () => { orbit.target.set(0, 1.17, 0); camera.position.set(2.5, 1.8, 4.1); orbit.update(); });
window.addEventListener("resize", () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
renderer.setAnimationLoop(() => { clock.update(); const dt = Math.min(clock.getDelta(), .05); mixer?.update(dt); orbit.update(); renderer.render(scene, camera); });
