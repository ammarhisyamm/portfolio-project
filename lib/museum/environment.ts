import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PALETTE, canvasTexture, carpetTexture, haloTexture, paintingTexture, roundRugTexture, skyTexture, starTileTexture, titleTexture, wallpaper, wrapText } from "./materials";
import { createLightShaft } from "./light-shafts";

export type Obstacle = { x: number; z: number; halfX: number; halfZ: number };

export function createMuseumEnvironment(scene: THREE.Scene, mobile: boolean) {
  const architecture = new THREE.Group();
  scene.add(architecture);
  // Storybook materials: cream plaster, royal-blue walls, soft gold trim. Low
  // metalness keeps colours saturated instead of mirroring a dark room.
  const marble = new THREE.MeshStandardMaterial({ color: PALETTE.plaster, roughness: .58 });
  const brass = new THREE.MeshStandardMaterial({ color: PALETTE.gold, metalness: .45, roughness: .32, emissive: "#7a4a06", emissiveIntensity: .28 });
  const darkBrass = new THREE.MeshStandardMaterial({ color: PALETTE.goldDeep, metalness: .4, roughness: .4 });
  const wall = new THREE.MeshStandardMaterial({ color: PALETTE.royal, roughness: .86 });
  wallpaper(wall);
  const wainscot = new THREE.MeshStandardMaterial({ color: PALETTE.cream, roughness: .62 });
  const black = new THREE.MeshStandardMaterial({ color: PALETTE.purpleDeep, roughness: .7 });
  const velvet = new THREE.MeshStandardMaterial({ color: PALETTE.purple, roughness: .82 });
  const white = new THREE.MeshStandardMaterial({ color: "#fff8ee", roughness: .5 });
  const lamps: THREE.PointLight[] = [];
  const halos: THREE.Sprite[] = [];
  const beams: THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial>[] = [];
  const spots: THREE.SpotLight[] = [];
  let lightAmount = 1, lightTarget = 1, time = 0;
  const obstacles: Obstacle[] = [];
  const glowMap = haloTexture();
  const glowMaterial = new THREE.SpriteMaterial({ map: glowMap, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const flame = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffdca0").multiplyScalar(3.2), toneMapped: false });
  // Thin warm cove lines under the cornices: they read as gilded light in the bloom.
  const cove = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffb557").multiplyScalar(1.9), toneMapped: false });
  const flickers: { halo: THREE.Sprite; phase: number }[] = [];

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
  // A glossy star-tile floor and a red velvet runner down the axis. There is
  // no mirror pass: the sheen comes from the environment map, which is cheap.
  const floorMap = starTileTexture();
  floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping; floorMap.repeat.set(7, 11.5);
  const floorMaterial = new THREE.MeshStandardMaterial({ map: floorMap, roughness: .34, envMapIntensity: .4 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(29, 48), floorMaterial);
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, .016, -10); floor.receiveShadow = true; scene.add(floor);
  const carpetMap = carpetTexture(); carpetMap.wrapT = THREE.RepeatWrapping; carpetMap.repeat.set(1, 10);
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 41), new THREE.MeshStandardMaterial({ map: carpetMap, roughness: .95 }));
  carpet.rotation.x = -Math.PI / 2; carpet.position.set(0, .022, -9.2); carpet.receiveShadow = true; scene.add(carpet);
  const rugMap = roundRugTexture();
  const rugMaterial = new THREE.MeshStandardMaterial({ map: rugMap, transparent: true, roughness: .95 });
  function roundRug(x: number, z: number, radius: number) {
    const rug = new THREE.Mesh(new THREE.CircleGeometry(radius, 40), rugMaterial);
    rug.rotation.x = -Math.PI / 2; rug.position.set(x, .026, z); rug.receiveShadow = true; scene.add(rug);
  }

  // Actual architectural volumes: a central nave, side bays, and arched windows.
  // The west wall is split around two side doors: the studio and the Reading Room.
  // A second door further north opens into the Reading Room.
  box(-14, 5.5, -6.25, 1, 11, 14.3, wall); box(-14, 5.5, 9.05, 1, 11, 9.9, wall); box(-14, 8.3, 2.5, 1, 5.4, 3.2, wall);
  box(-14, 5.5, -25.3, 1, 11, 17.4, wall); box(-14, 8.3, -15, 1, 5.4, 3.2, wall);
  box(14, 1.3, -10, 1, 2.6, 48, wall);
  box(0, 5.5, -34, 29, 11, 1, wall);
  box(0, 5.5, 14, 29, 11, .5, wall);
  // The room has an entrance when the player turns around, not an empty sky.
  // These are physical door leaves and outer moldings, coherent with the intro.
  box(0, .14, 12.9, 7.1, .28, 1.8, black);
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
  const vault = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 48, 48, 1, true, Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: "#7f86e8", roughness: .9, side: THREE.BackSide }));
  vault.rotation.x = Math.PI / 2; vault.scale.z = .25; vault.position.set(0, 9, -10); architecture.add(vault);
  // Recessed wall bays and slim gilded reveals carry the architectural rhythm
  // into the side rooms instead of leaving a single unbroken flat wall.
  for (const z of [-29, -22, -8, -1, 6]) {
    for (const dz of [-1.8, 1.8]) box(-13.38, 4.6, z + dz, .034, 6.9, .034, darkBrass);
    for (const y of [1.15, 8.05]) box(-13.38, y, z, .034, .034, 3.64, brass);
    box(-13.36, 4.6, z - 1.82, .04, 6.9, .012, brass);
  }
  // Cream wainscot with gold rails runs round the hall below the blue walls.
  for (const [x, z, length] of [[-13.6, -6.25, 14.3], [-13.6, 9.05, 9.9], [-13.6, -25.3, 17.4], [13.6, -10, 48]] as [number, number, number][]) {
    box(x, 1.25, z, .22, 2.5, length, wainscot);
    box(x, 2.52, z, .3, .1, length, brass);
    box(x, .14, z, .3, .28, length, black);
    const side = x < 0 ? 1 : -1;
    for (let along = z - length / 2 + 1.1; along < z + length / 2 - .6; along += 2.2) {
      box(x + side * .12, 1.3, along, .02, 1.5, 1.6, darkBrass);
      box(x + side * .13, 1.3, along, .02, 1.4, 1.5, wainscot);
    }
  }
  for (const [z, w] of [[-33.4, 29], [13.8, 29]] as [number, number][]) {
    for (const [cx, len] of z > 0 ? [[-8.6, 11.8], [8.6, 11.8]] : [[0, w]]) {
      box(cx, 1.25, z, len, 2.5, .22, wainscot); box(cx, 2.52, z, len, .1, .3, brass);
    }
  }
  for (const x of [-13.65, 13.65]) {
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
  const windowMap = skyTexture();
  function windowBay(x: number, z: number, rotation: number, width = 4.3) {
    const g = new THREE.Group(); g.position.set(x, 1, z); g.rotation.y = rotation; architecture.add(g);
    const opening = archShape(width + .46, 9.5);
    const hole = new THREE.Path(), r = width / 2, spring = 9.24 - r + .12;
    hole.moveTo(-r, .12); hole.lineTo(r, .12); hole.lineTo(r, spring); hole.absarc(0, spring, r, 0, Math.PI, false); hole.lineTo(-r, .12);
    opening.holes.push(hole);
    const border = new THREE.Mesh(new THREE.ExtrudeGeometry(opening, { depth: .22, bevelEnabled: false, curveSegments: 28 }), marble);
    border.castShadow = true;
    g.add(border);
    const pane = new THREE.Mesh(new THREE.ShapeGeometry(archShape(width, 9.24), 32), new THREE.MeshBasicMaterial({ map: windowMap, toneMapped: false, side: THREE.DoubleSide }));
    pane.position.set(0, .12, .24); g.add(pane);
    for (const dx of [-width / 4, 0, width / 4]) box(dx, 4.8, .31, .12, 8.6, .1, white, g);
    for (const y of [2.3, 4.6, 6.8]) box(0, y, .33, width, .13, .11, white, g);
    for (const dx of [-width / 2 - .1, width / 2 + .1]) box(dx, 7.6, .32, .34, .34, .2, brass, g);
    box(0, 0, .2, width + .75, .22, .65, marble, g);
    box(0, 9.6, -.2, width + 1.4, .6, 1.2, marble, g);
  }
  for (const z of [-27, -17, -4, 8]) windowBay(13.45, z, -Math.PI / 2);
  windowBay(0, -33.35, 0, 5.4);
  // Side door: walnut reveals, a round brass-edged arch and a tiny plaque.
  for (const dz of [-1.72, 1.72]) { box(-13.42, 2.8, -15 + dz, .3, 5.6, .26); box(-13.26, 2.8, -15 + dz * .93, .03, 5.5, .03, brass); }
  box(-13.42, 5.66, -15, .3, .26, 3.7);
  const doorArch = new THREE.Mesh(new THREE.TorusGeometry(1.6, .13, 8, 32, Math.PI), marble); doorArch.rotation.y = Math.PI / 2; doorArch.position.set(-13.42, 5.6, -15); architecture.add(doorArch);
  const doorRim = new THREE.Mesh(new THREE.TorusGeometry(1.6, .025, 6, 32, Math.PI), brass); doorRim.rotation.y = Math.PI / 2; doorRim.position.set(-13.26, 5.6, -15); architecture.add(doorRim);
  const doorPlaque = new THREE.Mesh(new THREE.PlaneGeometry(.9, .3), new THREE.MeshBasicMaterial({ map: canvasTexture(384, 128, ctx => {
    ctx.fillStyle = PALETTE.purple; ctx.fillRect(0, 0, 384, 128); ctx.strokeStyle = PALETTE.gold; ctx.lineWidth = 8; ctx.strokeRect(6, 6, 372, 116);
    ctx.fillStyle = "#fff3d6"; ctx.font = "italic bold 38px Georgia"; ctx.textAlign = "center"; ctx.fillText("the studio", 192, 62); ctx.fillStyle = "#ffd98a"; ctx.font = "bold 19px Arial"; ctx.fillText("curious visitors welcome", 192, 98);
  }), toneMapped: false }));
  doorPlaque.rotation.y = Math.PI / 2; doorPlaque.position.set(-13.25, 3.3, -17.65); architecture.add(doorPlaque);
  // The Reading Room door: the same reveals and arch, and its own plaque.
  for (const dz of [-1.72, 1.72]) { box(-13.42, 2.8, 2.5 + dz, .3, 5.6, .26); box(-13.26, 2.8, 2.5 + dz * .93, .03, 5.5, .03, brass); }
  box(-13.42, 5.66, 2.5, .3, .26, 3.7);
  const readingArch = doorArch.clone(); readingArch.position.z = 2.5; architecture.add(readingArch);
  const readingRim = doorRim.clone(); readingRim.position.z = 2.5; architecture.add(readingRim);
  const readingPlaque = new THREE.Mesh(new THREE.PlaneGeometry(.9, .3), new THREE.MeshBasicMaterial({ map: canvasTexture(384, 128, ctx => {
    ctx.fillStyle = PALETTE.purple; ctx.fillRect(0, 0, 384, 128); ctx.strokeStyle = PALETTE.gold; ctx.lineWidth = 8; ctx.strokeRect(6, 6, 372, 116);
    ctx.fillStyle = "#fff3d6"; ctx.font = "italic bold 38px Georgia"; ctx.textAlign = "center"; ctx.fillText("reading room", 192, 62); ctx.fillStyle = "#ffd98a"; ctx.font = "bold 19px Arial"; ctx.fillText("articles & notes", 192, 98);
  }), toneMapped: false }));
  readingPlaque.rotation.y = Math.PI / 2; readingPlaque.position.set(-13.25, 3.3, -.15); architecture.add(readingPlaque);

  // Bright daytime lighting: a warm sun through the arched windows, a sky fill
  // that lifts the shadows to lavender, and soft pools from the lamps.
  const sun = new THREE.DirectionalLight("#fff0d4", 2.1);
  sun.position.set(12, 19, -18); sun.target.position.set(-2, 0, -4); scene.add(sun, sun.target);
  sun.castShadow = true; sun.shadow.mapSize.set(mobile ? 512 : 1024, mobile ? 512 : 1024);
  Object.assign(sun.shadow.camera, { left: -23, right: 23, top: 25, bottom: -25, near: 1, far: 65 });
  sun.shadow.bias = -.0005; sun.shadow.normalBias = .04;
  const ambient = new THREE.HemisphereLight("#fff4e2", "#a985d8", .78); scene.add(ambient);
  const rimLight = new THREE.DirectionalLight("#ffe2bd", .7);
  rimLight.position.set(-8, 7, 13); scene.add(rimLight);
  // Local pools of light give exhibits depth without flattening the entire room.
  // One per gallery wall and one on the contact desk at the end of the axis.
  for (const [x, z] of [[-8.6, -3.4], [8.6, -3.4], [-8.6, -22.6], [8.6, -22.6], [0, -26.6]]) {
    const spot = new THREE.SpotLight("#ffe4bd", 22, 13, x ? .55 : .42, .8, 2);
    spot.position.set(x * .45, 7.6, z + (x ? 0 : 3)); spot.target.position.set(x, 1.6, z);
    scene.add(spot, spot.target); spots.push(spot);
  }

  function lantern(x: number, z: number, height = 3.3, light = false) {
    cylinder(x, height - .42, z, .04, .055, .8, brass);
    cylinder(x, height + .05, z, .18, .23, .1, brass);
    cylinder(x, height + .47, z, .16, .22, .12, brass);
    for (const dx of [-.14, .14]) for (const dz of [-.14, .14]) box(x + dx, height + .25, z + dz, .022, .47, .022, brass);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.074, 12, 8), flame); bulb.scale.y = 1.8; bulb.position.set(x, height + .25, z); architecture.add(bulb);
    const halo = new THREE.Sprite(glowMaterial); halo.position.copy(bulb.position); halo.scale.set(1.5, 1.5, 1.5); scene.add(halo); halos.push(halo);
    if (light) { const p = new THREE.PointLight("#ffd79a", 14, 11, 2); p.position.copy(bulb.position); scene.add(p); lamps.push(p); }
  }
  for (const z of [-23, -8, 7]) { lantern(-11.35, z, 4.4, true); lantern(11.35, z, 4.4, !mobile); }

  // Candle sconces on the wall piers: brass back plate, a short arm, a glowing
  // flame and a soft halo that flickers a little.
  const candle = new THREE.MeshStandardMaterial({ color: "#fff6e6", roughness: .6, emissive: "#6b4a18", emissiveIntensity: .25 });
  function sconce(x: number, z: number, side: number, height = 3.5) {
    const wallX = x + side * -.02;
    box(wallX, height - .05, z, .04, .5, .2, brass);
    box(wallX - side * .14, height - .2, z, .26, .03, .03, brass);
    cylinder(wallX - side * .27, height - .16, z, .07, .045, .06, brass);
    cylinder(wallX - side * .27, height - .04, z, .022, .022, .2, candle);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(.03, 10, 8), flame); tip.scale.y = 1.9; tip.position.set(wallX - side * .27, height + .1, z); architecture.add(tip);
    const halo = new THREE.Sprite(glowMaterial.clone()); halo.position.copy(tip.position); halo.scale.setScalar(1.1); scene.add(halo); halos.push(halo);
    flickers.push({ halo, phase: x * 1.7 + z * .9 });
  }
  for (const z of [-25.5, -18.6, -11.4, -4.5, 9.4]) sconce(-13.46, z, -1);
  for (const z of [-21.6, -10.4, 2]) sconce(13.46, z, 1, 3.7);
  for (const x of [-13.38, 13.38]) box(x, 9.43, -10, .03, .035, 48, cove);
  // The chandelier pours light onto the crossing.
  const chandelier = new THREE.PointLight("#ffd79a", 26, 17, 2); chandelier.position.set(0, 7.7, -11); scene.add(chandelier); lamps.push(chandelier);

  // GPU ray-marched, feathered shafts replace the visibly flat cone surfaces.
  for (const z of mobile ? [-17] : [-27, -17, -4, 8]) {
    const beam = createLightShaft(new THREE.Vector3(13.15, 9, z), new THREE.Vector3(3.6, .25, z + 3.6), 2.3, mobile);
    scene.add(beam); beams.push(beam);
  }

  // Round potted trees with chunky, bright canopies, like a toy-box topiary.
  const wood = new THREE.MeshStandardMaterial({ color: PALETTE.woodDeep, roughness: .75 });
  const leaves = [new THREE.MeshStandardMaterial({ color: PALETTE.leaf, roughness: .78 }), new THREE.MeshStandardMaterial({ color: PALETTE.green, roughness: .8 })];
  function pottedTree(x: number, z: number) {
    cylinder(x, .5, z, .58, .42, 1, velvet);
    ring(x, .98, z, .58, .07); ring(x, .1, z, .44, .05);
    cylinder(x, 1.02, z, .5, .5, .06, wood);
    cylinder(x, 1.9, z, .07, .13, 1.8, wood);
    for (const [dx, y, dz, r, tone] of [[0, 3.1, 0, .95, 0], [-.55, 2.6, .25, .62, 1], [.58, 2.7, -.2, .66, 0], [.1, 2.5, .6, .55, 1], [-.2, 3.75, -.15, .6, 1], [.35, 3.5, .35, .5, 0]] as [number, number, number, number, number][]) {
      const crown = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), leaves[tone]); crown.position.set(x + dx, y, z + dz); crown.castShadow = true; architecture.add(crown);
    }
    obstacles.push({ x, z, halfX: .6, halfZ: .6 });
  }
  pottedTree(-11.3, -20.3); pottedTree(11.2, -29); pottedTree(-11.5, 10);

  // White busts on cream pedestals, each on its own round purple rug.
  const sculpture = new THREE.MeshStandardMaterial({ color: "#fbf7f1", roughness: .55 });
  for (const [x, z] of [[-10.9, -29], [-10.8, -11.2], [10.8, 10]]) {
    roundRug(x, z, 1.25);
    box(x, .76, z, 1.05, 1.52, 1.05); box(x, 1.57, z, 1.23, .13, 1.23, brass); box(x, .08, z, 1.2, .16, 1.2, brass);
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
  // A tufted purple bench down the middle of the second gallery, for looking both ways.
  box(0, .5, -20.3, .9, .26, 3.3, velvet);
  for (const dz of [-1.1, -.37, .37, 1.1]) { const button = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), brass); button.position.set(0, .64, -20.3 + dz); architecture.add(button); }
  box(0, .35, -20.3, .96, .06, 3.36, brass);
  for (const [dx, dz] of [[-.36, -1.5], [.36, -1.5], [-.36, 1.5], [.36, 1.5]]) cylinder(dx, .17, -20.3 + dz, .07, .05, .34, brass);
  obstacles.push({ x: 0, z: -20.3, halfX: .55, halfZ: 1.75 });
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
  const statueMaterial = sculpture;
  for (const s of [-1, 1]) cylinder(s * .15, .55, 0, .105, .13, 1.1, statueMaterial, statue);
  const drape = new THREE.Mesh(new THREE.ConeGeometry(.42, 1.1, 18), statueMaterial); drape.position.y = 1.1; statue.add(drape);
  cylinder(0, 1.61, 0, .1, .12, .2, statueMaterial, statue);
  const statueHead = new THREE.Mesh(new THREE.SphereGeometry(.19, 24, 18), statueMaterial); statueHead.scale.y = 1.35; statueHead.position.y = 1.92; statue.add(statueHead);
  for (const s of [-1, 1]) { const arm = cylinder(s * .31, 1.14, 0, .077, .065, .8, statueMaterial, statue); arm.rotation.z = s * .23; }
  const bannerShape = new THREE.Shape(); bannerShape.moveTo(-.72, 0); bannerShape.lineTo(.72, 0); bannerShape.lineTo(.72, -2.1); bannerShape.lineTo(0, -2.64); bannerShape.lineTo(-.72, -2.1); bannerShape.closePath();
  const banner = new THREE.Mesh(new THREE.ShapeGeometry(bannerShape), new THREE.MeshStandardMaterial({ color: PALETTE.purple, side: THREE.DoubleSide, roughness: .9 })); banner.position.set(0, 9.1, -16); architecture.add(banner);
  box(0, 9.12, -16, 1.7, .08, .08, brass);
  const bannerMap = canvasTexture(256, 256, ctx => { ctx.strokeStyle = PALETTE.gold; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(128, 128, 100, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = PALETTE.gold; ctx.font = "bold 140px Georgia"; ctx.textAlign = "center"; ctx.fillText("h", 128, 172); });
  const bannerMark = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.05), new THREE.MeshStandardMaterial({ map: bannerMap, transparent: true, roughness: .5 })); bannerMark.position.set(0, 7.86, -15.98); architecture.add(bannerMark);

  // A gilded compass star set into the runner at the crossing.
  const emblem = canvasTexture(1024, 1024, ctx => {
    ctx.fillStyle = PALETTE.gold; ctx.beginPath(); ctx.arc(512, 512, 500, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = PALETTE.purple; ctx.beginPath(); ctx.arc(512, 512, 455, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = PALETTE.gold; ctx.beginPath();
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 170 : 430; ctx.lineTo(512 + Math.cos(a) * r, 512 + Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = PALETTE.cream; ctx.beginPath(); ctx.arc(512, 512, 150, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = PALETTE.ink; ctx.font = "italic bold 230px Georgia"; ctx.textAlign = "center"; ctx.fillText("h", 512, 590);
  });
  const seal = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), new THREE.MeshStandardMaterial({ map: emblem, roughness: .45, metalness: .1 }));
  seal.rotation.x = -Math.PI / 2; seal.position.set(0, .03, -3.4); seal.receiveShadow = true; scene.add(seal);

  // Each gallery wall carries its title above the cases.
  for (const [title, sub, number, x, z, rotation] of [
    ["Selected Work", "Product design", "01", -13.38, -3.4, Math.PI / 2],
    ["Process", "Research. Decisions. Delivery.", "02", 13.38, -22, -Math.PI / 2],
    ["Showcase", "Websites, dashboards, apps", "03", 13.38, 2, -Math.PI / 2],
    ["About", "The person behind the work", "04", -13.38, -22.6, Math.PI / 2],
    ["Contact", "Start a conversation", "05", 6.2, -33.35, 0],
  ] as [string, string, string, number, number, number][]) {
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ map: titleTexture(title, sub, "", number), toneMapped: false }));
    sign.position.set(x, 6.1, z); sign.rotation.y = rotation; architecture.add(sign);
  }
  // Gilded frames with painted canvases dress the two end walls.
  const paintings: THREE.Texture[] = [];
  for (const [kind, x, z, w, h, rotation] of [
    ["field", -6.6, -33.38, 2.6, 3.2, 0], ["cat", -11, -33.38, 1.5, 1.9, 0], ["sunflowers", 11, -33.38, 1.5, 1.9, 0],
    ["stars", 7.6, 13.62, 2.6, 3.2, Math.PI], ["sunflowers", -7.6, 13.62, 2.6, 3.2, Math.PI], ["cat", 11.6, 13.62, 1.5, 1.9, Math.PI], ["field", -11.6, 13.62, 1.5, 1.9, Math.PI],
  ] as ["field" | "sunflowers" | "cat" | "stars", number, number, number, number, number][]) {
    const g = new THREE.Group(); g.position.set(x, 5.9, z); g.rotation.y = rotation; architecture.add(g);
    const map = paintingTexture(kind); paintings.push(map);
    const canvas = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map, roughness: .8 })); canvas.position.z = .06; g.add(canvas);
    for (const [px, py, pw, ph] of [[0, h / 2 + .09, w + .36, .18], [0, -h / 2 - .09, w + .36, .18], [-w / 2 - .09, 0, .18, h], [w / 2 + .09, 0, .18, h]]) box(px, py, .04, pw, ph, .14, brass, g);
    for (const [px, py] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) box(px * (w / 2 + .09), py * (h / 2 + .09), .12, .26, .26, .08, darkBrass, g);
  }
  // Wayfinding totems at each threshold, readable from the central aisle.
  function totem(x: number, z: number, rotation: number, lines: [string, string][]) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotation; architecture.add(g);
    box(0, .06, 0, .9, .12, .5, brass, g); box(0, 1.05, 0, .86, 1.94, .12, black, g); box(0, 2.06, 0, .94, .09, .18, brass, g);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(.12, 14, 10), brass); cap.position.set(0, 2.22, 0); g.add(cap);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(.74, 1.6), new THREE.MeshBasicMaterial({ toneMapped: false, map: canvasTexture(296, 640, ctx => {
      ctx.fillStyle = PALETTE.purple; ctx.fillRect(0, 0, 296, 640); ctx.strokeStyle = PALETTE.gold; ctx.lineWidth = 8; ctx.strokeRect(10, 10, 276, 620);
      lines.forEach(([number, label], i) => {
        ctx.fillStyle = "#ffd98a"; ctx.font = "bold 24px Arial"; ctx.fillText(number, 30, 80 + i * 150);
        ctx.fillStyle = "#fff6e2"; ctx.font = "bold 34px Georgia"; wrapText(ctx, label, 30, 122 + i * 150, 240, 38, 2);
      });
    }) }));
    face.position.set(0, 1.08, .052); g.add(face);
    obstacles.push({ x, z, halfX: .5, halfZ: .5 });
  }
  totem(-3.4, 4.2, 0, [["01  ←", "Selected Work"], ["03  →", "Showcase"], ["06  ←", "Reading Room"]]);
  totem(3.4, -11.6, 0, [["04  ←", "About"], ["02  →", "Process"], ["05  ↑", "Contact"]]);

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
      sun.intensity = .35 + lightAmount * 1.75; ambient.intensity = .4 + lightAmount * .38;
      rimLight.intensity = .25 + lightAmount * .45;
      lamps.forEach(light => { light.intensity = lightAmount * (light === chandelier ? 26 : 14); });
      spots.forEach(light => { light.intensity = lightAmount * 22; });
      halos.forEach(halo => { halo.material.opacity = lightAmount; });
      time += delta;
      if (!reduced) flickers.forEach(({ halo, phase }) => { halo.material.opacity = lightAmount * (.82 + .12 * Math.sin(time * 7.3 + phase) + .06 * Math.sin(time * 13.1 + phase * 2)); });
      cove.color.setRGB(1, .78, .36).multiplyScalar(.3 + lightAmount * 1.2);
      beams.forEach(beam => { beam.material.uniforms.intensity.value = lightAmount * .26; });
    },
    dispose() { paintings.forEach(map => map.dispose()); floorMap.dispose(); carpetMap.dispose(); rugMap.dispose(); glowMap.dispose(); windowMap.dispose(); emblem.dispose(); bannerMap.dispose(); },
  };
}
