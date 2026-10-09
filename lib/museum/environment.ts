import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { canvasTexture, haloTexture, stoneTexture, titleTexture } from "./materials";

export type Obstacle = { x: number; z: number; halfX: number; halfZ: number };

export function createMuseumEnvironment(scene: THREE.Scene, marbleMap: THREE.Texture, mobile: boolean) {
  const architecture = new THREE.Group();
  scene.add(architecture);
  const marble = new THREE.MeshStandardMaterial({ map: marbleMap, color: "#a4a093", metalness: .18, roughness: .3 });
  const brass = new THREE.MeshStandardMaterial({ color: "#b79a62", metalness: .84, roughness: .27 });
  const darkBrass = new THREE.MeshStandardMaterial({ color: "#68502d", metalness: .76, roughness: .44 });
  const stoneMap = stoneTexture(); stoneMap.wrapS = stoneMap.wrapT = THREE.RepeatWrapping;
  const wall = new THREE.MeshStandardMaterial({ color: "#746c5d", map: stoneMap, roughness: .86 });
  const black = new THREE.MeshStandardMaterial({ color: "#211e1a", roughness: .9 });
  const lamps: THREE.PointLight[] = [];
  const halos: THREE.Sprite[] = [];
  const beams: THREE.Mesh[] = [];
  const obstacles: Obstacle[] = [];
  const glowMap = haloTexture();
  const glowMaterial = new THREE.SpriteMaterial({ map: glowMap, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const flame = new THREE.MeshBasicMaterial({ color: "#ffe5b2", toneMapped: false });

  function box(x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material = marble, parent: THREE.Group = architecture) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
    return mesh;
  }
  function cylinder(x: number, y: number, z: number, top: number, bottom: number, h: number, material: THREE.Material, parent: THREE.Group = architecture) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, h, 20), material);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function ring(x: number, y: number, z: number, radius: number, tube: number, material = brass) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 6, 36), material);
    mesh.rotation.x = Math.PI / 2; mesh.position.set(x, y, z); architecture.add(mesh); return mesh;
  }
  const floorMap = marbleMap.clone(); floorMap.needsUpdate = true;
  floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping; floorMap.repeat.set(7, 11);
  const floorMaterial = new THREE.MeshStandardMaterial({ map: floorMap, color: "#9c9587", roughness: .26, metalness: .25, transparent: !mobile, opacity: mobile ? 1 : .78 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(29, 48), floorMaterial);
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, .016, -10); floor.receiveShadow = true; scene.add(floor);
  let reflection: Reflector | null = null;
  if (!mobile) {
    reflection = new Reflector(new THREE.PlaneGeometry(29, 48), { textureWidth: 768, textureHeight: 768, color: "#76634c", clipBias: .003 });
    reflection.rotation.x = -Math.PI / 2; reflection.position.set(0, .008, -10); scene.add(reflection);
  }

  // Actual architectural volumes: a central nave, side bays, and arched windows.
  box(-14, 5.5, -10, 1, 11, 48, wall);
  box(14, 1.3, -10, 1, 2.6, 48, wall);
  box(0, 5.5, -34, 29, 11, 1, wall);
  box(0, 12.5, -10, 29, .6, 48, black).castShadow = false;
  for (const x of [-13.65, 13.65]) {
    box(x, .32, -10, .32, .64, 48);
    box(x, .66, -10, .35, .055, 48, brass);
    box(x, 9.8, -10, .45, .3, 48);
    box(x, 9.58, -10, .5, .045, 48, brass);
  }
  for (const z of [-26, -11, 5]) {
    for (const x of [-12.2, 12.2]) {
      box(x, .18, z, 1.6, .36, 1.6);
      box(x, .43, z, 1.38, .16, 1.38, darkBrass);
      cylinder(x, 4.66, z, .47, .55, 8.1, marble);
      cylinder(x, .75, z, .65, .7, .28, marble);
      cylinder(x, 8.83, z, .8, .53, .35, marble);
      box(x, 9.06, z, 1.58, .22, 1.6);
      ring(x, .72, z, .6, .034); ring(x, 8.66, z, .52, .036);
      for (const offset of [-.2, 0, .2]) box(x + offset, 4.68, z + .49, .027, 7.56, .024, darkBrass);
      obstacles.push({ x, z, halfX: .8, halfZ: .8 });
    }
    const arch = new THREE.Mesh(new THREE.TorusGeometry(12.2, .38, 12, 52, Math.PI), marble);
    arch.scale.y = .28; arch.position.set(0, 9.05, z); architecture.add(arch);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(12.25, .047, 6, 52, Math.PI), brass);
    rim.scale.y = .28; rim.position.set(0, 9.1, z + .38); architecture.add(rim);
    box(0, 12.3, z, 28, .4, .45);
  }

  function archShape(width: number, height: number) {
    const shape = new THREE.Shape();
    const r = width / 2, spring = height - r;
    shape.moveTo(-r, 0); shape.lineTo(r, 0); shape.lineTo(r, spring);
    shape.absarc(0, spring, r, 0, Math.PI, false); shape.lineTo(-r, 0);
    return shape;
  }
  const windowMap = canvasTexture(512, 1024, ctx => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, "#d8dbe0"); gradient.addColorStop(.5, "#f6e7c6"); gradient.addColorStop(1, "#c4a77b");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 512, 1024);
    ctx.fillStyle = "rgba(114,95,75,.12)";
    for (let i = 0; i < 8; i++) ctx.fillRect(i * 69, 640 + (i % 3) * 40, 38, 500);
  });
  function windowBay(x: number, z: number, rotation: number, width = 4.3) {
    const g = new THREE.Group(); g.position.set(x, 1, z); g.rotation.y = rotation; architecture.add(g);
    const opening = archShape(width + .46, 9.5);
    const hole = new THREE.Path(), r = width / 2, spring = 9.24 - r + .12;
    hole.moveTo(-r, .12); hole.lineTo(r, .12); hole.lineTo(r, spring); hole.absarc(0, spring, r, 0, Math.PI, false); hole.lineTo(-r, .12);
    opening.holes.push(hole);
    const border = new THREE.Mesh(new THREE.ExtrudeGeometry(opening, { depth: .22, bevelEnabled: false, curveSegments: 28 }), marble);
    border.castShadow = true;
    g.add(border);
    const pane = new THREE.Mesh(new THREE.ShapeGeometry(archShape(width, 9.24), 32), new THREE.MeshBasicMaterial({ map: windowMap, color: "#f4dfa9", toneMapped: false, side: THREE.DoubleSide }));
    pane.position.set(0, .12, .24); g.add(pane);
    for (const dx of [-width / 4, 0, width / 4]) box(dx, 4.8, .31, .075, 8.6, .08, darkBrass, g);
    for (const y of [2.3, 4.6, 6.8]) box(0, y, .33, width, .09, .09, darkBrass, g);
    box(0, 0, .2, width + .75, .22, .65, marble, g);
    box(0, 9.6, -.2, width + 1.4, .6, 1.2, marble, g);
  }
  for (const z of [-27, -17, -4, 8]) windowBay(13.45, z, -Math.PI / 2);
  windowBay(0, -33.35, 0, 5.4);

  const sun = new THREE.DirectionalLight("#fff0d1", 3.5);
  sun.position.set(12, 19, -18); sun.target.position.set(-2, 0, -4); scene.add(sun, sun.target);
  sun.castShadow = true; sun.shadow.mapSize.set(mobile ? 512 : 1536, mobile ? 512 : 1536);
  Object.assign(sun.shadow.camera, { left: -23, right: 23, top: 25, bottom: -25, near: 1, far: 65 });
  sun.shadow.bias = -.0005; sun.shadow.normalBias = .04;
  const ambient = new THREE.HemisphereLight("#f7e6c8", "#383022", 1.05); scene.add(ambient);

  function lantern(x: number, z: number, height = 3.3, light = false) {
    cylinder(x, height - .42, z, .04, .055, .8, brass);
    cylinder(x, height + .05, z, .18, .23, .1, brass);
    cylinder(x, height + .47, z, .16, .22, .12, brass);
    for (const dx of [-.14, .14]) for (const dz of [-.14, .14]) box(x + dx, height + .25, z + dz, .022, .47, .022, brass);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.074, 12, 8), flame); bulb.scale.y = 1.8; bulb.position.set(x, height + .25, z); architecture.add(bulb);
    const halo = new THREE.Sprite(glowMaterial); halo.position.copy(bulb.position); halo.scale.set(1.5, 1.5, 1.5); scene.add(halo); halos.push(halo);
    if (light) { const p = new THREE.PointLight("#ffcb81", 22, 10, 2); p.position.copy(bulb.position); scene.add(p); lamps.push(p); }
  }
  for (const z of [-23, -8, 7]) { lantern(-11.35, z, 4.4, true); lantern(11.35, z, 4.4); }

  // Warm shafts have volume, but never sit in front of readable exhibit labels.
  if (!mobile) for (const z of [-17, -4, 8]) {
    const beam = new THREE.Mesh(new THREE.ConeGeometry(2.15, 15, 20, 1, true), new THREE.MeshBasicMaterial({ color: "#edbd79", transparent: true, opacity: .025, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    beam.position.set(8, 5.3, z - 1); beam.rotation.z = -.48; scene.add(beam); beams.push(beam);
  }

  function oliveTree(x: number, z: number) {
    cylinder(x, .5, z, .53, .36, 1, marble);
    ring(x, .95, z, .53, .025);
    cylinder(x, 2.4, z, .045, .14, 3.2, black);
    const leafMat = new THREE.MeshStandardMaterial({ color: "#63573a", roughness: .95 });
    const leaves = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 5, 4), leafMat, mobile ? 65 : 145);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < leaves.count; i++) {
      const a = i * 2.399, r = Math.sqrt((i % 37) / 37) * 1.35;
      dummy.position.set(x + Math.cos(a) * r, 2.45 + (i % 17) / 17 * 2, z + Math.sin(a) * r);
      dummy.scale.set(.11, .19, .06); dummy.rotation.set(i, a, i * .23); dummy.updateMatrix(); leaves.setMatrixAt(i, dummy.matrix);
    }
    leaves.castShadow = true; scene.add(leaves);
    obstacles.push({ x, z, halfX: .55, halfZ: .55 });
  }
  oliveTree(-9.6, -19.8); oliveTree(9.6, -29); oliveTree(-11.5, 10);

  // Small stone studies and furniture make the bays feel occupied.
  const sculpture = new THREE.MeshStandardMaterial({ color: "#c5b69b", roughness: .86 });
  for (const [x, z] of [[-9.5, -29], [-10.8, -11.2], [10.8, 10]]) {
    box(x, .76, z, 1.05, 1.52, 1.05); box(x, 1.57, z, 1.23, .13, 1.23, brass);
    const shoulders = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), sculpture); shoulders.scale.set(.47, .27, .26); shoulders.position.set(x, 1.92, z); architecture.add(shoulders);
    cylinder(x, 2.18, z, .11, .15, .32, sculpture);
    const head = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), sculpture); head.scale.set(.25, .36, .26); head.position.set(x, 2.58, z); architecture.add(head);
    box(x, 2.59, z + .26, .075, .14, .075, sculpture);
    obstacles.push({ x, z, halfX: .7, halfZ: .7 });
  }
  box(-7.2, .63, 10, 4, .22, 1.1, black);
  for (const x of [-8.8, -5.7]) cylinder(x, .3, 10, .06, .06, .6, brass);
  obstacles.push({ x: -7.2, z: 10, halfX: 2.15, halfZ: .8 });
  ring(0, 8.4, -11, 1.6, .045);
  cylinder(0, 10.3, -11, .032, .032, 3.8, brass);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; lantern(Math.cos(a) * 1.6, -11 + Math.sin(a) * 1.6, 8.5); }

  const emblem = canvasTexture(1024, 1024, ctx => {
    ctx.strokeStyle = "#a68a54"; ctx.lineWidth = 3;
    for (const r of [455, 421, 345]) { ctx.beginPath(); ctx.arc(512, 512, r, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = "#ab915f"; ctx.font = "italic 480px Georgia"; ctx.textAlign = "center"; ctx.fillText("h", 512, 658);
  });
  const seal = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 6.2), new THREE.MeshBasicMaterial({ map: emblem, transparent: true, depthWrite: false, toneMapped: false }));
  seal.rotation.x = -Math.PI / 2; seal.position.set(0, .025, 1); scene.add(seal);

  for (const [title, sub, x, z, rotation] of [
    ["Selected\nWork", "Product design", -13.38, -5, Math.PI / 2],
    ["Playground", "Studies and experiments", 13.38, 2, -Math.PI / 2],
    ["About", "The person behind the work", -13.38, 7, Math.PI / 2],
    ["Process", "Research. Decisions. Delivery.", -6, -33.35, 0],
    ["Contact", "Start a conversation", 7, -33.35, 0],
  ] as [string, string, number, number, number][]) {
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: titleTexture(title.replace("\n", " "), sub), toneMapped: false }));
    sign.position.set(x, 4.8, z); sign.rotation.y = rotation; architecture.add(sign);
  }

  // Merge repeating architectural materials to keep the renderer draw count low.
  architecture.updateMatrixWorld(true);
  const groups = new Map<string, { material: THREE.Material; shadow: boolean; geometries: THREE.BufferGeometry[] }>();
  architecture.traverse(object => {
    if (!(object instanceof THREE.Mesh) || Array.isArray(object.material)) return;
    const geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone(); geometry.applyMatrix4(object.matrixWorld);
    const shadow = object.castShadow && !(object.material instanceof THREE.MeshBasicMaterial), key = `${object.material.uuid}:${shadow}`;
    const entry = groups.get(key) ?? { material: object.material, shadow, geometries: [] as THREE.BufferGeometry[] };
    entry.geometries.push(geometry); groups.set(key, entry);
    object.geometry.dispose();
  });
  scene.remove(architecture);
  const batched = new THREE.Group(); scene.add(batched);
  for (const { material, shadow, geometries } of groups.values()) {
    const merged = mergeGeometries(geometries, false);
    if (merged) {
      const mesh = new THREE.Mesh(merged, material); mesh.castShadow = shadow; mesh.receiveShadow = true; batched.add(mesh);
      geometries.forEach(geometry => geometry.dispose());
    } else {
      for (const geometry of geometries) { const mesh = new THREE.Mesh(geometry, material); mesh.castShadow = shadow; mesh.receiveShadow = true; batched.add(mesh); }
    }
  }

  return {
    marble, brass, obstacles,
    setLights(on: boolean) {
      sun.intensity = on ? 3.5 : .35;
      ambient.intensity = on ? 1.05 : .52;
      lamps.forEach(light => { light.intensity = on ? 22 : 0; });
      halos.forEach(halo => { halo.visible = on; });
      beams.forEach(beam => { beam.visible = on; });
    },
    dispose() { reflection?.dispose(); floorMap.dispose(); glowMap.dispose(); stoneMap.dispose(); windowMap.dispose(); emblem.dispose(); },
  };
}
