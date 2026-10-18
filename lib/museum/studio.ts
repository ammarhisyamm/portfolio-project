import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PALETTE, canvasTexture, haloTexture, loadImage, skyTexture, wallpaper } from "./materials";
import type { Obstacle } from "./environment";
import type { MuseumExhibit } from "./types";

/** The studio wing sits behind the side door in the hall's west wall. */
export const STUDIO_BOUNDS = { minX: -28.9, maxX: -15.1, minZ: -24.9, maxZ: -5.1 };
export const STUDIO_DOOR = { minX: -15.3, maxX: -11.1, minZ: -16.2, maxZ: -13.8 };

/** Where each hidden find lives. Content decides which of these exist. */
const SPOTS: Record<string, [number, number, number]> = {
  "secret-journal": [-25.4, .66, -16.2],
  "secret-sketchbook": [-21.5, .52, -14.8],
  "secret-cv": [-23.3, .86, -5.25],
  "secret-shelf": [-22.2, 1.62, -25.05],
  "secret-pinboard": [-18.6, 1.95, -25.55],
  "secret-olive": [-10.95, 1.02, 9.5],
  "secret-plinth": [-10.8, .08, -10.35],
};

export type StudioSecret = { id: string; position: THREE.Vector3; glow: THREE.Sprite; found: boolean };

export function createStudioWing(scene: THREE.Scene, exhibits: MuseumExhibit[], brass: THREE.Material, mobile: boolean, signal: AbortSignal) {
  const wing = new THREE.Group(); scene.add(wing);
  const obstacles: Obstacle[] = [], targets: THREE.Object3D[] = [], secrets: StudioSecret[] = [], lamps: THREE.PointLight[] = [];
  const textures: THREE.Texture[] = [];
  const keep = <T extends THREE.Texture>(texture: T) => { textures.push(texture); return texture; };

  const parquet = keep(canvasTexture(512, 512, ctx => {
    // Herringbone-style staggered planks with seeded tone variation.
    let seed = 7;
    for (let row = 0; row < 16; row++) for (let col = 0; col < 4; col++) {
      seed = (seed * 16807) % 2147483647;
      const tone = 92 + seed % 26;
      ctx.fillStyle = `rgb(${tone + 112},${tone + 46},${tone - 22})`;
      const offset = row % 2 ? 64 : 0;
      ctx.fillRect(col * 128 + offset - 128, row * 32, 127, 31); ctx.fillRect(col * 128 + offset, row * 32, 127, 31);
      ctx.fillStyle = "rgba(120,60,20,.22)"; for (let i = 0; i < 6; i++) ctx.fillRect(col * 128 + offset + (seed >> i) % 120, row * 32 + 4 + i * 4, 30, 1);
    }
  }));
  parquet.wrapS = parquet.wrapT = THREE.RepeatWrapping; parquet.repeat.set(5, 7);
  const floor = new THREE.MeshStandardMaterial({ map: parquet, roughness: .45 });
  const plaster = new THREE.MeshStandardMaterial({ color: PALETTE.green, roughness: .88 }); wallpaper(plaster);
  const walnut = new THREE.MeshStandardMaterial({ color: PALETTE.wood, roughness: .6 });
  const darkWood = new THREE.MeshStandardMaterial({ color: PALETTE.woodDeep, roughness: .7 });
  const leather = new THREE.MeshStandardMaterial({ color: PALETTE.red, roughness: .55 });
  const fabric = new THREE.MeshStandardMaterial({ color: PALETTE.purple, roughness: .9 });
  const paper = new THREE.MeshStandardMaterial({ color: "#efe6d2", roughness: .9 });
  const cork = new THREE.MeshStandardMaterial({ color: "#a47d55", roughness: 1 });
  const ceramic = new THREE.MeshStandardMaterial({ color: "#d9d2c4", roughness: .45 });
  const leaf = new THREE.MeshStandardMaterial({ color: PALETTE.leaf, roughness: .8 });
  const screen = new THREE.MeshBasicMaterial({ color: "#a9e0ff", toneMapped: false });
  const bulb = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffe3b0").multiplyScalar(2.6), toneMapped: false });
  const rugMap = keep(canvasTexture(512, 512, ctx => {
    ctx.fillStyle = PALETTE.red; ctx.beginPath(); ctx.arc(256, 256, 254, 0, Math.PI * 2); ctx.fill();
    for (const [r, color, width] of [[236, PALETTE.gold, 12], [200, PALETTE.purple, 22], [150, PALETTE.gold, 6], [92, PALETTE.redDeep, 40]] as [number, string, number][]) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.arc(256, 256, r, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = PALETTE.gold; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; ctx.beginPath(); ctx.arc(256 + Math.cos(a) * 172, 256 + Math.sin(a) * 172, 7, 0, Math.PI * 2); ctx.fill(); }
  }));
  const rug = new THREE.MeshStandardMaterial({ map: rugMap, transparent: true, roughness: 1 });

  function box(x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material, rounded = 0) {
    const mesh = new THREE.Mesh(rounded ? new RoundedBoxGeometry(w, h, d, 2, rounded) : new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; wing.add(mesh); return mesh;
  }
  function cylinder(x: number, y: number, z: number, top: number, bottom: number, h: number, material: THREE.Material, segments = 18) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, h, segments), material);
    mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; wing.add(mesh); return mesh;
  }

  // Shell: parquet, sage plaster walls, walnut wainscot and a beamed ceiling.
  const cx = -22.4, cz = -15, width = 15.6, depth = 21.4;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), floor); ground.rotation.x = -Math.PI / 2; ground.position.set(cx, .012, cz); ground.receiveShadow = true; scene.add(ground);
  box(-30.5, 3.3, cz, .6, 6.6, depth + 1.2, plaster); box(cx, 3.3, -26, width + 1.6, 6.6, .6, plaster); box(cx, 3.3, -4, width + 1.6, 6.6, .6, plaster);
  box(cx, 6.75, cz, width + 1.6, .3, depth + 1.2, darkWood);
  for (let z = -24; z <= -6; z += 3) box(cx, 6.45, z, width, .28, .32, walnut);
  box(cx, 6.2, cz, .3, .22, depth, walnut);
  for (const [x, z, w, d] of [[-30.15, cz, .1, depth], [cx, -25.65, width, .1], [cx, -4.35, width, .1]]) { box(x, .6, z, w, 1.2, d, walnut); box(x, 1.23, z, w + .04, .06, d + .04, brass); box(x, .07, z, w + .06, .14, d + .06, darkWood); }
  // The hall-side face of the studio around the door.
  box(-14.55, .6, -20.7, .1, 1.2, 8.2, walnut); box(-14.55, .6, -9.5, .1, 1.2, 8.2, walnut);

  // An arched window on the west wall with warm "outside" light.
  const windowMap = keep(skyTexture(256, 512));
  const arch = new THREE.Shape(); arch.moveTo(-1.1, 0); arch.lineTo(1.1, 0); arch.lineTo(1.1, 2.8); arch.absarc(0, 2.8, 1.1, 0, Math.PI, false); arch.closePath();
  const pane = new THREE.Mesh(new THREE.ShapeGeometry(arch, 24), new THREE.MeshBasicMaterial({ map: windowMap, toneMapped: false }));
  pane.rotation.y = Math.PI / 2; pane.position.set(-30.17, 1.4, cz); wing.add(pane);
  for (const dz of [-.37, .37]) box(-30.12, 3.35, cz + dz, .05, 3.9, .05, darkWood);
  for (const y of [2.4, 3.6]) box(-30.12, y, cz, .05, .05, 2.2, darkWood);
  box(-29.95, 1.35, cz, .5, .1, 2.6, walnut);
  const windowLight = new THREE.SpotLight("#ffcf94", mobile ? 22 : 34, 14, .7, .8, 1.4); windowLight.position.set(-29.6, 4.4, cz); windowLight.target.position.set(-23, 0, cz + 1); scene.add(windowLight, windowLight.target);

  // Bookshelves: walnut carcasses with instanced, varied spines.
  const spines = ["#7b2f25", "#2f4757", "#c49a55", "#3c5236", "#e2d6bd", "#5b3a5b", "#8c5a2b", "#1f2b3a", "#a8462f", "#d8b36a"];
  let seed = 19;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // Each unit is built facing local +z, then turned to face into the room.
  const bookMatrices: THREE.Matrix4[] = [], bookColors: THREE.Color[] = [];
  function shelf(x: number, z: number, length: number, rotation: number, shelves = 5) {
    const frame = new THREE.Group(); frame.position.set(x, 0, z); frame.rotation.y = rotation; wing.add(frame);
    const part = (w: number, h: number, d: number, px: number, py: number, pz: number, m: THREE.Material) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); mesh.position.set(px, py, pz); mesh.castShadow = mesh.receiveShadow = true; frame.add(mesh); };
    part(length, 4.4, .05, 0, 2.2, -.22, darkWood);
    for (const side of [-1, 1]) part(.06, 4.4, .5, side * (length / 2 - .03), 2.2, 0, walnut);
    part(length + .16, .14, .58, 0, 4.47, 0, walnut); part(length, .12, .5, 0, .06, 0, walnut);
    frame.updateMatrixWorld(true);
    for (let level = 0; level < shelves; level++) {
      const y = .12 + level * .84;
      if (level) part(length - .1, .045, .46, 0, y, 0, darkWood);
      let along = -length / 2 + .1;
      while (along < length / 2 - .2) {
        const bw = .05 + random() * .06, bh = .4 + random() * .28;
        if (random() < .07) { along += .16; continue; }
        const lean = random() < .07 ? -.22 : 0;
        dummy.position.set(along + bw / 2 + (lean ? .08 : 0), y + .025 + bh / 2 - (lean ? .02 : 0), -.02); dummy.rotation.set(0, 0, lean); dummy.scale.set(bw, bh, .3 + random() * .08); dummy.updateMatrix();
        bookMatrices.push(frame.matrixWorld.clone().multiply(dummy.matrix));
        bookColors.push(new THREE.Color(spines[Math.floor(random() * spines.length)]).multiplyScalar(.75 + random() * .4));
        along += bw + .006 + (lean ? .12 : 0);
      }
    }
    const alongX = Math.abs(Math.sin(rotation)) < .5;
    obstacles.push({ x, z, halfX: alongX ? length / 2 : .3, halfZ: alongX ? .3 : length / 2 });
  }
  const dummy = new THREE.Object3D();
  shelf(-29.75, -21.4, 5.2, Math.PI / 2); shelf(-29.75, -8.6, 5.2, Math.PI / 2); shelf(-24.6, -25.45, 7.2, 0); shelf(-15.6, -25.45, 2.6, 0, 4);
  const bookMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: .78 }), bookMatrices.length);
  bookMatrices.forEach((matrix, i) => { bookMesh.setMatrixAt(i, matrix); bookMesh.setColorAt(i, bookColors[i]); });
  bookMesh.castShadow = bookMesh.receiveShadow = true; scene.add(bookMesh);

  // Reading nook: round rug, leather armchair, side table, floor lamp, sofa.
  const rugMesh = new THREE.Mesh(new THREE.CircleGeometry(2.9, 48), rug); rugMesh.rotation.x = -Math.PI / 2; rugMesh.position.set(-22.2, .02, -15); rugMesh.receiveShadow = true; scene.add(rugMesh);
  function armchair(x: number, z: number, rotation: number) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotation; wing.add(g);
    const part = (w: number, h: number, d: number, px: number, py: number, pz: number, m = leather) => { const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, .07), m); mesh.position.set(px, py, pz); mesh.castShadow = mesh.receiveShadow = true; g.add(mesh); };
    part(1.15, .36, 1, 0, .38, 0); part(1.2, .9, .26, 0, .82, -.45); part(.22, .55, 1, -.55, .62, 0); part(.22, .55, 1, .55, .62, 0); part(.92, .14, .82, 0, .6, .06, fabric);
    for (const sx of [-.48, .48]) for (const sz of [-.4, .4]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(.03, .025, .2, 8), darkWood); leg.position.set(sx, .1, sz); g.add(leg); }
  }
  armchair(-24.2, -17.2, Math.PI / 4); obstacles.push({ x: -24.2, z: -17.2, halfX: .7, halfZ: .7 });
  cylinder(-25.4, .3, -16.2, .32, .32, .04, walnut, 24); cylinder(-25.4, .62, -16.2, .34, .34, .05, walnut, 24); cylinder(-25.4, .3, -16.2, .04, .04, .6, darkWood);
  obstacles.push({ x: -25.4, z: -16.2, halfX: .34, halfZ: .34 });
  cylinder(-25.6, .03, -18.5, .2, .22, .06, brass); cylinder(-25.6, 1.1, -18.5, .018, .018, 2.1, brass);
  const shade = cylinder(-25.6, 2.15, -18.5, .2, .34, .36, new THREE.MeshStandardMaterial({ color: "#e8d3a8", roughness: .9, side: THREE.DoubleSide, emissive: "#ffcb87", emissiveIntensity: .35 }), 24); shade.castShadow = false;
  const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(.06, 10, 8), bulb); lampBulb.position.set(-25.6, 2.1, -18.5); scene.add(lampBulb);
  const reading = new THREE.PointLight("#ffc77d", 14, 7, 2); reading.position.set(-25.6, 2.05, -18.5); scene.add(reading); lamps.push(reading);
  obstacles.push({ x: -25.6, z: -18.5, halfX: .22, halfZ: .22 });
  // Sofa facing the coffee table, with cushions and a throw.
  const sofa = new THREE.Group(); sofa.position.set(-20.2, 0, -11.7); sofa.rotation.y = Math.PI; wing.add(sofa);
  for (const [w, h, d, x, y, z, m] of [[2.6, .4, .95, 0, .36, 0, fabric], [2.7, .8, .24, 0, .78, .45, fabric], [.24, .55, .95, -1.32, .58, 0, fabric], [.24, .55, .95, 1.32, .58, 0, fabric], [1.15, .16, .78, -.6, .63, -.04, fabric], [1.15, .16, .78, .6, .63, -.04, fabric], [.5, .42, .14, -.85, .9, .26, leather], [.5, .42, .14, .8, .9, .26, new THREE.MeshStandardMaterial({ color: "#c49a55", roughness: .95 })]] as [number, number, number, number, number, number, THREE.Material][]) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, .06), m); mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; sofa.add(mesh);
  }
  obstacles.push({ x: -20.2, z: -11.6, halfX: 1.45, halfZ: .55 });
  box(-21.5, .44, -14.8, 1.4, .07, .85, walnut, .02); for (const sx of [-.6, .6]) for (const sz of [-.35, .35]) cylinder(-21.5 + sx, .21, -14.8 + sz, .03, .03, .42, darkWood);
  obstacles.push({ x: -21.5, z: -14.8, halfX: .72, halfZ: .45 });
  // Coffee table props: open sketchbook, mug, small stack of books.
  box(-21.5, .49, -14.8, .42, .02, .3, paper).rotation.y = .3;
  box(-21.1, .5, -15.0, .3, .06, .22, new THREE.MeshStandardMaterial({ color: "#2f4757", roughness: .7 })).rotation.y = -.2;
  cylinder(-21.95, .53, -14.6, .045, .04, .1, ceramic, 14);
  // Journal on the side table.
  box(-25.4, .66, -16.2, .24, .035, .32, leather, .01).rotation.y = .5;

  // Desk against the south wall: laptop, desk lamp, CV papers, plant.
  box(-24, .8, -5.25, 2.6, .07, 1, walnut, .02);
  for (const sx of [-1.2, 1.2]) box(-24 + sx, .4, -5.25, .08, .78, .9, darkWood);
  box(-24.6, .48, -5.25, .6, .55, .85, darkWood);
  box(-24.5, .845, -5.3, .5, .018, .34, new THREE.MeshStandardMaterial({ color: "#8d9093", metalness: .7, roughness: .35 }));
  const lid = box(-24.5, 1.0, -5.12, .5, .32, .015, new THREE.MeshStandardMaterial({ color: "#8d9093", metalness: .7, roughness: .35 })); lid.rotation.x = -.28;
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(.45, .27), screen); glow.position.set(-24.5, 1.0, -5.132); glow.rotation.x = -.28; glow.rotation.y = Math.PI; wing.add(glow);
  for (let i = 0; i < 3; i++) box(-23.3 + i * .015, .845 + i * .005, -5.25, .3, .004, .4, paper).rotation.y = .12 * i - .1;
  cylinder(-22.9, .84, -5.05, .08, .1, .02, brass); const arm = cylinder(-22.9, 1.1, -5.05, .015, .015, .55, brass); arm.rotation.z = .3;
  cylinder(-23.0, 1.36, -5.15, .02, .1, .14, new THREE.MeshStandardMaterial({ color: "#2f3a2c", metalness: .3, roughness: .5 }));
  cylinder(-25.1, .9, -5.0, .06, .05, .14, ceramic, 14);
  for (let i = 0; i < 9; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(.07, 6, 5), leaf); l.scale.set(.6, 1.4, .3); l.position.set(-25.1 + Math.cos(i * 2.4) * .06, 1.02 + (i % 3) * .05, -5 + Math.sin(i * 2.4) * .06); l.rotation.set(i * .7, i, .4); wing.add(l); }
  const chair = new THREE.Group(); chair.position.set(-24, 0, -6.35); chair.rotation.y = .2; wing.add(chair);
  for (const [w, h, d, x, y, z] of [[.55, .06, .5, 0, .5, 0], [.55, .55, .05, 0, .8, -.25]] as number[][]) { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, .02), walnut); m.position.set(x, y, z); m.castShadow = true; chair.add(m); }
  for (const sx of [-.23, .23]) for (const sz of [-.2, .2]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .5, 8), darkWood); leg.position.set(sx, .25, sz); chair.add(leg); }
  obstacles.push({ x: -24, z: -5.25, halfX: 1.32, halfZ: .55 }, { x: -24, z: -6.35, halfX: .32, halfZ: .32 });
  // Fig tree in a pot in the corner, and a record cabinet with a turntable.
  cylinder(-28.6, .35, -5.4, .32, .25, .7, ceramic, 20);
  cylinder(-28.6, 1.4, -5.4, .03, .05, 1.6, darkWood);
  const fig = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 5), leaf, mobile ? 70 : 140);
  for (let i = 0; i < fig.count; i++) { const a = i * 2.399, r = Math.sqrt((i % 23) / 23) * .62; dummy.position.set(-28.6 + Math.cos(a) * r, 1.35 + (i % 13) / 13 * 1.2, -5.4 + Math.sin(a) * r); dummy.scale.set(.13, .2, .04); dummy.rotation.set(i, a, i * .3); dummy.updateMatrix(); fig.setMatrixAt(i, dummy.matrix); }
  fig.castShadow = true; scene.add(fig);
  obstacles.push({ x: -28.6, z: -5.4, halfX: .4, halfZ: .4 });
  box(-18.2, .45, -4.95, 1.8, .9, .6, walnut, .02);
  for (let i = 0; i < 14; i++) box(-18.95 + i * .11, .45, -5.2, .012, .7, .02, new THREE.MeshStandardMaterial({ color: spines[i % spines.length], roughness: .8 }));
  cylinder(-17.8, .93, -4.95, .2, .2, .02, new THREE.MeshStandardMaterial({ color: "#111", roughness: .4 }), 32);
  cylinder(-17.8, .945, -4.95, .07, .07, .005, new THREE.MeshStandardMaterial({ color: "#a8462f", roughness: .7 }), 20);
  obstacles.push({ x: -18.2, z: -4.95, halfX: .92, halfZ: .32 });

  // Pinboard of studio photos above the low shelf (filled from CMS images).
  box(-18.6, 1.95, -25.68, 2.4, 1.4, .05, cork);
  box(-18.6, 1.95, -25.7, 2.52, 1.52, .04, walnut);
  const pinboard = exhibits.find(item => item.id === "secret-pinboard");
  const photoFrames: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const material = new THREE.MeshStandardMaterial({ color: "#f4efe4", roughness: .85 });
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(.52, .6), material);
    photo.position.set(-19.4 + (i % 3) * .8, 2.27 - Math.floor(i / 3) * .66, -25.645); photo.rotation.z = (random() - .5) * .16; scene.add(photo); photoFrames.push(photo);
  }
  pinboard?.images?.forEach((src, i) => {
    if (!photoFrames[i]) return;
    loadImage(src).then(image => {
      if (!image || signal.aborted) return;
      const map = keep(canvasTexture(256, 296, ctx => {
        ctx.fillStyle = "#f4efe4"; ctx.fillRect(0, 0, 256, 296);
        const s = Math.max(232 / image.width, 232 / image.height);
        ctx.save(); ctx.beginPath(); ctx.rect(12, 12, 232, 232); ctx.clip(); ctx.drawImage(image, 12 + (232 - image.width * s) / 2, 12 + (232 - image.height * s) / 2, image.width * s, image.height * s); ctx.restore();
      }));
      const material = photoFrames[i].material as THREE.MeshStandardMaterial; material.map = map; material.needsUpdate = true;
    });
  });

  // A round cat bed under the window, and a pendant over the nook.
  const bed = new THREE.Mesh(new THREE.TorusGeometry(.36, .13, 10, 28), fabric); bed.rotation.x = Math.PI / 2; bed.position.set(-28.1, .13, -13.2); bed.castShadow = true; wing.add(bed);
  cylinder(-28.1, .05, -13.2, .36, .36, .08, new THREE.MeshStandardMaterial({ color: "#c49a55", roughness: 1 }), 24);
  cylinder(-22.2, 5.4, -15, .012, .012, 2.4, brass);
  const pendant = cylinder(-22.2, 4.1, -15, .12, .5, .4, new THREE.MeshStandardMaterial({ color: PALETTE.gold, metalness: .45, roughness: .35, side: THREE.DoubleSide }), 28); pendant.castShadow = false;
  const pendantBulb = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8), bulb); pendantBulb.position.set(-22.2, 3.9, -15); scene.add(pendantBulb);
  const nook = new THREE.PointLight("#ffd29a", mobile ? 18 : 24, 12, 1.6); nook.position.set(-22.2, 3.75, -15); scene.add(nook); lamps.push(nook);
  const deskLight = new THREE.PointLight("#ffd7a0", 6, 4, 2); deskLight.position.set(-23.1, 1.3, -5.3); scene.add(deskLight); lamps.push(deskLight);

  // Hidden finds: a soft glint that only shows when the visitor is close.
  const halo = keep(haloTexture());
  for (const exhibit of exhibits) {
    const spot = SPOTS[exhibit.id]; if (!exhibit.secret || !spot) continue;
    const position = new THREE.Vector3(...spot);
    const glint = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, color: "#ffdca0", transparent: true, depthWrite: false, opacity: 0, blending: THREE.AdditiveBlending, toneMapped: false }));
    glint.position.copy(position).add(new THREE.Vector3(0, .1, 0)); glint.scale.setScalar(.5); scene.add(glint);
    if (exhibit.id === "secret-olive" || exhibit.id === "secret-plinth") {
      const note = new THREE.Mesh(new THREE.BoxGeometry(.22, .012, .15), paper); note.position.copy(position); note.rotation.y = .4; note.castShadow = true; scene.add(note);
      note.userData.exhibitId = exhibit.id; targets.push(note);
    }
    const hit = new THREE.Mesh(new THREE.SphereGeometry(.35, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.copy(position); hit.userData.exhibitId = exhibit.id; scene.add(hit); targets.push(hit);
    secrets.push({ id: exhibit.id, position, glow: glint, found: false });
  }
  // The one book that sticks out of the shelf.
  if (secrets.some(item => item.id === "secret-shelf")) box(-22.2, 1.62, -25.05, .09, .55, .34, new THREE.MeshStandardMaterial({ color: "#c49a55", metalness: .3, roughness: .5, emissive: "#6b4a1c", emissiveIntensity: .25 }));

  // Merge the static furniture by material to keep draw calls low.
  wing.updateMatrixWorld(true);
  const groups = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const meshes: THREE.Mesh[] = [];
  wing.traverse(object => { if (object instanceof THREE.Mesh && !Array.isArray(object.material)) meshes.push(object); });
  for (const mesh of meshes) {
    const g = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
    for (const name of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(name)) g.deleteAttribute(name);
    g.applyMatrix4(mesh.matrixWorld); mesh.geometry.dispose();
    const list = groups.get(mesh.material as THREE.Material) ?? []; list.push(g); groups.set(mesh.material as THREE.Material, list);
  }
  scene.remove(wing);
  const batched = new THREE.Group(); scene.add(batched);
  for (const [material, geometries] of groups) {
    const merged = mergeGeometries(geometries, false);
    const shadow = !(material instanceof THREE.MeshBasicMaterial);
    if (merged) { const mesh = new THREE.Mesh(merged, material); mesh.castShadow = shadow; mesh.receiveShadow = true; batched.add(mesh); geometries.forEach(g => g.dispose()); }
    else geometries.forEach(g => { const mesh = new THREE.Mesh(g, material); mesh.castShadow = shadow; mesh.receiveShadow = true; batched.add(mesh); });
  }

  let lightAmount = 1, lightTarget = 1;
  return {
    obstacles, targets, secrets,
    setLights(on: boolean) { lightTarget = on ? 1 : 0; },
    markFound(id: string) { const secret = secrets.find(item => item.id === id); if (secret) secret.found = true; },
    update(delta: number, elapsed: number, player: THREE.Vector3, focus: string | null, reduced: boolean) {
      lightAmount = reduced ? lightTarget : THREE.MathUtils.damp(lightAmount, lightTarget, 10, delta);
      reading.intensity = 14 * (.25 + lightAmount * .75); nook.intensity = (mobile ? 18 : 24) * (.2 + lightAmount * .8); deskLight.intensity = 6 * (.4 + lightAmount * .6);
      windowLight.intensity = (mobile ? 22 : 34) * (.35 + lightAmount * .65);
      for (const secret of secrets) {
        const distance = Math.hypot(secret.position.x - player.x, secret.position.z - player.z);
        const near = THREE.MathUtils.clamp(1 - (distance - 1.4) / 3.2, 0, 1);
        const pulse = reduced ? 1 : .75 + Math.sin(elapsed * 2.4 + secret.position.x) * .25;
        const target = (focus === secret.id ? 1 : near * (secret.found ? .25 : .7)) * pulse;
        const material = secret.glow.material;
        material.opacity = reduced ? target : THREE.MathUtils.damp(material.opacity, target, 8, delta);
        secret.glow.scale.setScalar(focus === secret.id ? .75 : .5);
      }
    },
    dispose() { textures.forEach(texture => texture.dispose()); },
  };
}

export function inStudio(x: number, z: number) {
  return x >= STUDIO_BOUNDS.minX && x <= STUDIO_BOUNDS.maxX && z >= STUDIO_BOUNDS.minZ && z <= STUDIO_BOUNDS.maxZ;
}
export function inStudioDoor(x: number, z: number) {
  return x >= STUDIO_DOOR.minX && x <= STUDIO_DOOR.maxX && z >= STUDIO_DOOR.minZ && z <= STUDIO_DOOR.maxZ;
}
