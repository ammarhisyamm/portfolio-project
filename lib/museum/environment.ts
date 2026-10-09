import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { canvasTexture, haloTexture, stoneTexture, titleTexture } from "./materials";
import { createLightShaft } from "./light-shafts";

export type Obstacle = { x: number; z: number; halfX: number; halfZ: number };

export function createMuseumEnvironment(scene: THREE.Scene, marbleMap: THREE.Texture, mobile: boolean) {
  const architecture = new THREE.Group();
  scene.add(architecture);
  const marble = new THREE.MeshStandardMaterial({ map: marbleMap, color: "#9c9487", metalness: .12, roughness: .34 });
  const brass = new THREE.MeshStandardMaterial({ color: "#a47b3e", metalness: .78, roughness: .32 });
  const darkBrass = new THREE.MeshStandardMaterial({ color: "#68502d", metalness: .76, roughness: .44 });
  const stoneMap = stoneTexture(); stoneMap.wrapS = stoneMap.wrapT = THREE.RepeatWrapping;
  const wall = new THREE.MeshStandardMaterial({ color: "#746c5d", map: stoneMap, roughness: .86 });
  const black = new THREE.MeshStandardMaterial({ color: "#211e1a", roughness: .9 });
  const lamps: THREE.PointLight[] = [];
  const halos: THREE.Sprite[] = [];
  const beams: THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial>[] = [];
  const spots: THREE.SpotLight[] = [];
  let lightAmount = 1, lightTarget = 1;
  const obstacles: Obstacle[] = [];
  const glowMap = haloTexture();
  const glowMaterial = new THREE.SpriteMaterial({ map: glowMap, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const flame = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffe5b2").multiplyScalar(3), toneMapped: false });

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
  const floorMaterial = new THREE.MeshStandardMaterial({ map: floorMap, color: "#9c9587", roughness: .31, metalness: .16, transparent: !mobile, opacity: mobile ? 1 : .82 });
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
  box(0, 5.5, 14, 29, 11, .5, wall);
  // The room has an entrance when the player turns around, not an empty sky.
  // These are physical door leaves and outer moldings, coherent with the intro.
  box(0, .14, 12.9, 7.1, .28, 1.8);
  for (const x of [-1.25, 1.25]) {
    box(x, 3.95, 13.32, 2.47, 7.4, .22, black);
    for (const dx of [-1.1, 1.1]) box(x + dx, 3.95, 13.18, .026, 7.02, .025, brass);
    for (const y of [.46, 7.45]) box(x, y, 13.18, 2.22, .026, .025, brass);
    for (const dx of [-.99, .99]) box(x + dx, 3.95, 13.16, .018, 6.79, .018, darkBrass);
    cylinder(x < 0 ? -.14 : .14, 3.68, 13.09, .021, .021, .31, brass);
  }
  for (const x of [-2.68, 2.68]) { box(x, 3.95, 13.23, .32, 7.6, .4); box(x, 3.95, 13, .032, 7.7, .032, brass); }
  box(0, 7.75, 13.2, 5.75, .32, .4);
  const entryArch = new THREE.Mesh(new THREE.TorusGeometry(2.7, .19, 10, 48, Math.PI), marble); entryArch.position.set(0, 7.74, 13.3); architecture.add(entryArch);
  const entryRim = new THREE.Mesh(new THREE.TorusGeometry(2.7, .032, 8, 48, Math.PI), brass); entryRim.position.set(0, 7.74, 13.08); architecture.add(entryRim);
  box(0, 12.5, -10, 29, .6, 48, black).castShadow = false;
  const vault = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 48, 48, 1, true, Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: "#756b57", map: stoneMap, roughness: .9, side: THREE.BackSide }));
  vault.rotation.x = Math.PI / 2; vault.scale.z = .25; vault.position.set(0, 9, -10); architecture.add(vault);
  // Recessed wall bays and slim gilded reveals carry the architectural rhythm
  // into the side rooms instead of leaving a single unbroken flat wall.
  for (const z of [-29, -22, -15, -8, -1, 6]) {
    for (const dz of [-1.8, 1.8]) box(-13.38, 4.6, z + dz, .034, 6.9, .034, darkBrass);
    for (const y of [1.15, 8.05]) box(-13.38, y, z, .034, .034, 3.64, brass);
    box(-13.36, 4.6, z - 1.82, .04, 6.9, .012, brass);
  }
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
      for (const y of [.62, .9, 8.55, 8.95]) ring(x, y, z, y > 8 ? .58 : .67, .022);
      for (const offset of [-.2, 0, .2]) box(x + offset, 4.68, z + .49, .027, 7.56, .024, darkBrass);
      obstacles.push({ x, z, halfX: .8, halfZ: .8 });
    }
    const arch = new THREE.Mesh(new THREE.TorusGeometry(12.2, .38, 12, 52, Math.PI), marble);
    arch.scale.y = .28; arch.position.set(0, 9.05, z); architecture.add(arch);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(12.25, .047, 6, 52, Math.PI), brass);
    rim.scale.y = .28; rim.position.set(0, 9.1, z + .38); architecture.add(rim);
    for (const offset of [-.46, .46]) {
      const molding = new THREE.Mesh(new THREE.TorusGeometry(12.2, .11, 8, 64, Math.PI), darkBrass);
      molding.scale.y = .28; molding.position.set(0, 9.05, z + offset); architecture.add(molding);
      const edge = new THREE.Mesh(new THREE.TorusGeometry(12.2, .025, 6, 64, Math.PI), brass);
      edge.scale.y = .28; edge.position.set(0, 9.14, z + offset * 1.2); architecture.add(edge);
    }
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

  const sun = new THREE.DirectionalLight("#ffe3b5", 3.25);
  sun.position.set(12, 19, -18); sun.target.position.set(-2, 0, -4); scene.add(sun, sun.target);
  sun.castShadow = true; sun.shadow.mapSize.set(mobile ? 512 : 1536, mobile ? 512 : 1536);
  Object.assign(sun.shadow.camera, { left: -23, right: 23, top: 25, bottom: -25, near: 1, far: 65 });
  sun.shadow.bias = -.0005; sun.shadow.normalBias = .04;
  const ambient = new THREE.HemisphereLight("#e4dfd5", "#242225", .68); scene.add(ambient);
  const rimLight = new THREE.DirectionalLight("#c4d1df", .65);
  rimLight.position.set(-8, 7, 13); scene.add(rimLight);
  // Local pools of light give exhibits depth without flattening the entire room.
  for (const [x, z] of [[-7.5, -7.7], [-2.5, -7.7], [2.5, -7.7], [7.5, -7.7], [-2, -25]]) {
    const spot = new THREE.SpotLight("#ffd49a", 48, 13, .42, .7, 2);
    spot.position.set(x + 1.1, 7.3, z + 2.5); spot.target.position.set(x, 1.6, z);
    scene.add(spot, spot.target); spots.push(spot);
  }

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

  // GPU ray-marched, feathered shafts replace the visibly flat cone surfaces.
  for (const z of mobile ? [-17] : [-17, -4, 8]) {
    const beam = createLightShaft(new THREE.Vector3(13.15, 9, z), new THREE.Vector3(3.6, .25, z + 3.6), 2.3, mobile);
    scene.add(beam); beams.push(beam);
  }

  function oliveTree(x: number, z: number) {
    cylinder(x, .5, z, .53, .36, 1, marble);
    ring(x, .95, z, .53, .025);
    cylinder(x, 2.4, z, .045, .14, 3.2, black);
    const leafMat = new THREE.MeshStandardMaterial({ color: "#4d5939", roughness: .92 });
    for (let i = 0; i < 5; i++) {
      const branch = cylinder(x, 2.7 + i * .18, z, .022, .045, 1.25, black);
      branch.rotation.z = (i % 2 ? -1 : 1) * .65; branch.rotation.y = i * 1.6;
    }
    const leaves = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 5, 4), leafMat, mobile ? 140 : 320);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < leaves.count; i++) {
      const a = i * 2.399, r = Math.sqrt((i % 37) / 37) * 1.35;
      dummy.position.set(x + Math.cos(a) * r, 2.45 + (i % 17) / 17 * 2, z + Math.sin(a) * r);
      dummy.scale.set(.085, .23, .027); dummy.rotation.set(i, a, i * .23); dummy.updateMatrix(); leaves.setMatrixAt(i, dummy.matrix);
      leaves.setColorAt(i, new THREE.Color(i % 3 ? "#637149" : "#84915c"));
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
    const head = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), sculpture); head.scale.set(.22, .32, .23); head.position.set(x, 2.58, z); architecture.add(head);
    box(x, 2.59, z + .26, .075, .14, .075, sculpture);
    for (const s of [-1, 1]) {
      box(x + s * .09, 2.68, z + .207, .1, .027, .04, sculpture).rotation.z = -s * .13;
      const cheek = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), sculpture); cheek.scale.set(.073, .11, .05); cheek.position.set(x + s * .12, 2.5, z + .17); architecture.add(cheek);
    }
    obstacles.push({ x, z, halfX: .7, halfZ: .7 });
  }
  box(-7.2, .63, 10, 4, .22, 1.1, black);
  for (const x of [-8.8, -5.7]) cylinder(x, .3, 10, .06, .06, .6, brass);
  obstacles.push({ x: -7.2, z: 10, halfX: 2.15, halfZ: .8 });
  ring(0, 8.4, -11, 1.6, .045);
  cylinder(0, 10.3, -11, .032, .032, 3.8, brass);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; lantern(Math.cos(a) * 1.6, -11 + Math.sin(a) * 1.6, 8.5); }
  ring(0, 8.24, -11, 1.25, .028);
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    const arm = box(Math.cos(a) * .8, 8.38, -11 + Math.sin(a) * .8, 1.6, .026, .026, brass); arm.rotation.y = -a;
  }

  // An apse beyond the walkable floor, with shallow steps and a hanging banner.
  for (let i = 0; i < 3; i++) box(0, .15 + i * .21, -31.2 - i * .6, 7.2 - i * .6, .3, 2.7 - i * .5);
  box(0, 1.05, -32, 1.15, 1.4, 1.15);
  const statue = new THREE.Group(); statue.position.set(0, 1.74, -32); architecture.add(statue);
  const statueMaterial = new THREE.MeshStandardMaterial({ color: "#d2c4a7", roughness: .78 });
  for (const s of [-1, 1]) cylinder(s * .15, .55, 0, .105, .13, 1.1, statueMaterial, statue);
  const drape = new THREE.Mesh(new THREE.ConeGeometry(.42, 1.1, 18), statueMaterial); drape.position.y = 1.1; statue.add(drape);
  cylinder(0, 1.61, 0, .1, .12, .2, statueMaterial, statue);
  const statueHead = new THREE.Mesh(new THREE.SphereGeometry(.19, 24, 18), statueMaterial); statueHead.scale.y = 1.35; statueHead.position.y = 1.92; statue.add(statueHead);
  for (const s of [-1, 1]) { const arm = cylinder(s * .31, 1.14, 0, .077, .065, .8, statueMaterial, statue); arm.rotation.z = s * .23; }
  const bannerShape = new THREE.Shape(); bannerShape.moveTo(-.72, 0); bannerShape.lineTo(.72, 0); bannerShape.lineTo(.72, -2.1); bannerShape.lineTo(0, -2.64); bannerShape.lineTo(-.72, -2.1); bannerShape.closePath();
  const banner = new THREE.Mesh(new THREE.ShapeGeometry(bannerShape), new THREE.MeshStandardMaterial({ color: "#17181a", side: THREE.DoubleSide, roughness: .98 })); banner.position.set(0, 9.1, -16); architecture.add(banner);
  box(0, 9.12, -16, 1.6, .035, .035, brass);
  const bannerMap = canvasTexture(256, 256, ctx => { ctx.strokeStyle = "#ad8549"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(128, 128, 100, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = "#ad8549"; ctx.font = "140px Georgia"; ctx.textAlign = "center"; ctx.fillText("h", 128, 172); });
  const bannerMark = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.05), new THREE.MeshStandardMaterial({ map: bannerMap, transparent: true, roughness: .7, metalness: .35 })); bannerMark.position.set(0, 7.86, -15.98); architecture.add(bannerMark);

  const emblem = canvasTexture(1024, 1024, ctx => {
    ctx.strokeStyle = "#a68a54"; ctx.lineWidth = 3;
    for (const r of [455, 421, 345]) { ctx.beginPath(); ctx.arc(512, 512, r, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = "#ab915f"; ctx.font = "italic 480px Georgia"; ctx.textAlign = "center"; ctx.fillText("h", 512, 658);
  });
  const seal = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 6.2), new THREE.MeshStandardMaterial({ map: emblem, transparent: true, depthWrite: false, metalness: .55, roughness: .48, opacity: .8 }));
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
    setLights(on: boolean) { lightTarget = on ? 1 : 0; },
    update(delta: number, reduced: boolean) {
      lightAmount = reduced ? lightTarget : THREE.MathUtils.damp(lightAmount, lightTarget, 10, delta);
      sun.intensity = .3 + lightAmount * 2.95; ambient.intensity = .34 + lightAmount * .34;
      rimLight.intensity = .25 + lightAmount * .4;
      lamps.forEach(light => { light.intensity = lightAmount * 22; });
      spots.forEach(light => { light.intensity = lightAmount * 48; });
      halos.forEach(halo => { halo.material.opacity = lightAmount; });
      beams.forEach(beam => { beam.material.uniforms.intensity.value = lightAmount * .65; });
    },
    dispose() { reflection?.dispose(); floorMap.dispose(); glowMap.dispose(); stoneMap.dispose(); windowMap.dispose(); emblem.dispose(); bannerMap.dispose(); },
  };
}
