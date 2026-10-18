import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PALETTE, canvasTexture, coverTexture, loadImage, skyTexture, titleTexture, wallpaper } from "./materials";
import type { Obstacle } from "./environment";
import type { MuseumExhibit } from "./types";

/** The Reading Room sits behind a second door in the hall's west wall, beside the studio. */
export const LIBRARY_BOUNDS = { minX: -28.9, maxX: -15.1, minZ: -2.4, maxZ: 8.6 };
export const LIBRARY_DOOR = { minX: -15.3, maxX: -11.1, minZ: 1.3, maxZ: 3.7 };

export type LibraryDisplay = { id: string; position: THREE.Vector3; reach: number; frame: THREE.MeshStandardMaterial };

/** Same-origin copies of remote covers keep the canvas untainted so WebGL can use them. */
function textureSource(src: string) {
  return /^https?:\/\//.test(src) ? `/_next/image?url=${encodeURIComponent(src)}&w=640&q=70` : src;
}

export function createLibraryWing(scene: THREE.Scene, exhibits: MuseumExhibit[], marble: THREE.Material, brass: THREE.Material, mobile: boolean, signal: AbortSignal) {
  const wing = new THREE.Group(); scene.add(wing);
  const obstacles: Obstacle[] = [], targets: THREE.Object3D[] = [], displays: LibraryDisplay[] = [];
  const textures: THREE.Texture[] = [];
  const keep = <T extends THREE.Texture>(texture: T) => { textures.push(texture); return texture; };

  const boards = keep(canvasTexture(512, 512, ctx => {
    let seed = 11;
    for (let row = 0; row < 8; row++) {
      let x = row % 2 ? -90 : 0;
      while (x < 512) {
        seed = (seed * 16807) % 2147483647;
        const tone = 70 + seed % 22, length = 140 + seed % 120;
        ctx.fillStyle = `rgb(${tone + 140},${tone + 70},${tone - 6})`; ctx.fillRect(x, row * 64, length - 2, 62);
        ctx.fillStyle = "rgba(120,60,20,.2)"; for (let i = 0; i < 5; i++) ctx.fillRect(x + (seed >> i) % length, row * 64 + 8 + i * 10, 40, 1);
        x += length;
      }
    }
  }));
  boards.wrapS = boards.wrapT = THREE.RepeatWrapping; boards.repeat.set(4, 4);
  const floor = new THREE.MeshStandardMaterial({ map: boards, roughness: .45 });
  const plaster = new THREE.MeshStandardMaterial({ color: "#2f86c4", roughness: .88 }); wallpaper(plaster);
  const walnut = new THREE.MeshStandardMaterial({ color: PALETTE.wood, roughness: .6 });
  const darkWood = new THREE.MeshStandardMaterial({ color: PALETTE.woodDeep, roughness: .7 });
  const leather = new THREE.MeshStandardMaterial({ color: PALETTE.red, roughness: .55 });
  const felt = new THREE.MeshStandardMaterial({ color: PALETTE.green, roughness: .9 });
  const glassShade = new THREE.MeshStandardMaterial({ color: "#2f6b4a", roughness: .25, metalness: .1, emissive: "#3f8f5f", emissiveIntensity: .55 });
  const paper = new THREE.MeshStandardMaterial({ color: "#efe6d2", roughness: .9 });
  const bulb = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffe3b0").multiplyScalar(2.6), toneMapped: false });

  function box(x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material, rounded = 0) {
    const mesh = new THREE.Mesh(rounded ? new RoundedBoxGeometry(w, h, d, 2, rounded) : new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; wing.add(mesh); return mesh;
  }
  function cylinder(x: number, y: number, z: number, top: number, bottom: number, h: number, material: THREE.Material, segments = 18) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, h, segments), material);
    mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; wing.add(mesh); return mesh;
  }

  // Shell: oak boards, oxblood plaster, walnut wainscot, coffered ceiling. The
  // south wall is the studio's north wall; the east wall is the hall.
  const cx = -22.35, cz = 3.1, width = 15.7, depth = 13.6;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), floor); ground.rotation.x = -Math.PI / 2; ground.position.set(cx, .012, cz); ground.receiveShadow = true; scene.add(ground);
  box(-30.5, 3.3, cz, .6, 6.6, depth + 1.2, plaster); box(cx, 3.3, 10.2, width + 1.6, 6.6, .6, plaster);
  box(cx, 6.75, cz, width + 1.6, .3, depth + 1.2, darkWood);
  for (let x = -29; x <= -15.5; x += 2.7) box(x, 6.45, cz, .3, .28, depth, walnut);
  box(cx, 6.2, cz, width, .22, .3, walnut);
  for (const [x, z, w, d] of [[-30.15, cz, .1, depth], [cx, 9.85, width, .1], [cx, -3.65, width, .1], [-14.55, -1.4, .1, 4.6], [-14.55, 6.95, .1, 5.7]]) {
    box(x, .6, z, w, 1.2, d, walnut); box(x, 1.23, z, w + .04, .06, d + .04, brass); box(x, .07, z, w + .06, .14, d + .06, darkWood);
  }

  // Tall bookshelves on the north and south walls, with instanced spines.
  const spines = ["#7b2f25", "#2f4757", "#c49a55", "#3c5236", "#e2d6bd", "#5b3a5b", "#8c5a2b", "#1f2b3a", "#a8462f", "#d8b36a"];
  let seed = 23;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const dummy = new THREE.Object3D();
  const bookMatrices: THREE.Matrix4[] = [], bookColors: THREE.Color[] = [];
  function shelf(x: number, z: number, length: number, rotation: number, shelves = 6) {
    const frame = new THREE.Group(); frame.position.set(x, 0, z); frame.rotation.y = rotation; wing.add(frame);
    const part = (w: number, h: number, d: number, px: number, py: number, pz: number, m: THREE.Material) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); mesh.position.set(px, py, pz); mesh.castShadow = mesh.receiveShadow = true; frame.add(mesh); };
    part(length, 5.2, .05, 0, 2.6, -.22, darkWood);
    for (const side of [-1, 1]) part(.06, 5.2, .5, side * (length / 2 - .03), 2.6, 0, walnut);
    part(length + .16, .14, .58, 0, 5.27, 0, walnut); part(length, .12, .5, 0, .06, 0, walnut);
    frame.updateMatrixWorld(true);
    for (let level = 0; level < shelves; level++) {
      const y = .12 + level * .84;
      if (level) part(length - .1, .045, .46, 0, y, 0, darkWood);
      let along = -length / 2 + .1;
      while (along < length / 2 - .2) {
        const bw = .05 + random() * .06, bh = .4 + random() * .28;
        if (random() < .06) { along += .16; continue; }
        dummy.position.set(along + bw / 2, y + .025 + bh / 2, -.02); dummy.rotation.set(0, 0, 0); dummy.scale.set(bw, bh, .3 + random() * .08); dummy.updateMatrix();
        bookMatrices.push(frame.matrixWorld.clone().multiply(dummy.matrix));
        bookColors.push(new THREE.Color(spines[Math.floor(random() * spines.length)]).multiplyScalar(.75 + random() * .4));
        along += bw + .006;
      }
    }
    const alongX = Math.abs(Math.sin(rotation)) < .5;
    obstacles.push({ x, z, halfX: alongX ? length / 2 : .3, halfZ: alongX ? .3 : length / 2 });
  }
  shelf(-26.4, 9.6, 5.8, Math.PI); shelf(-18.3, 9.6, 5.8, Math.PI);
  shelf(-25.2, -3.4, 7, 0); shelf(-17.9, -3.4, 4.6, 0, 5);
  const bookMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: .78 }), bookMatrices.length);
  bookMatrices.forEach((matrix, i) => { bookMesh.setMatrixAt(i, matrix); bookMesh.setColorAt(i, bookColors[i]); });
  bookMesh.castShadow = bookMesh.receiveShadow = true; scene.add(bookMesh);

  // An arched window between the north shelves.
  const windowMap = keep(skyTexture(256, 512));
  const arch = new THREE.Shape(); arch.moveTo(-.9, 0); arch.lineTo(.9, 0); arch.lineTo(.9, 2.6); arch.absarc(0, 2.6, .9, 0, Math.PI, false); arch.closePath();
  const pane = new THREE.Mesh(new THREE.ShapeGeometry(arch, 24), new THREE.MeshBasicMaterial({ map: windowMap, toneMapped: false }));
  pane.rotation.y = Math.PI; pane.position.set(-22.35, 1.5, 9.87); wing.add(pane);
  box(-22.35, 3.1, 9.83, .05, 3.5, .05, darkWood); box(-22.35, 2.9, 9.83, 1.8, .05, .05, darkWood);
  box(-22.35, 1.45, 9.7, 2.2, .1, .4, walnut);

  // A long reading table with green banker's lamps and four chairs.
  box(-21.6, .8, 3.1, 4.2, .08, 1.4, walnut, .02);
  box(-21.6, .845, 3.1, 3.7, .01, .95, felt);
  for (const sx of [-1.95, 1.95]) for (const sz of [-.58, .58]) box(-21.6 + sx, .4, 3.1 + sz, .1, .78, .1, darkWood);
  obstacles.push({ x: -21.6, z: 3.1, halfX: 2.15, halfZ: .75 });
  for (const lx of [-22.8, -20.4]) {
    cylinder(lx, .87, 3.1, .1, .12, .04, brass); cylinder(lx, 1.05, 3.1, .015, .015, .34, brass);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(.06, .2, .14, 16, 1, true, 0, Math.PI), glassShade);
    shade.rotation.z = Math.PI / 2; shade.rotation.y = Math.PI / 2; shade.position.set(lx, 1.24, 3.1); shade.castShadow = false; wing.add(shade);
    const glow = new THREE.Mesh(new THREE.SphereGeometry(.04, 8, 6), bulb); glow.position.set(lx, 1.2, 3.1); scene.add(glow);
  }
  for (const [x, z] of [[-22.3, 3.45], [-20.6, 2.8]]) { box(x, .87, z, .34, .03, .46, paper).rotation.y = .25; box(x + .1, .89, z - .05, .3, .02, .4, paper).rotation.y = -.15; }
  function chair(x: number, z: number, rotation: number) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotation; wing.add(g);
    for (const [w, h, d, px, py, pz, m] of [[.5, .07, .48, 0, .5, 0, leather], [.5, .55, .06, 0, .82, -.23, walnut]] as [number, number, number, number, number, number, THREE.Material][]) { const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, .02), m); mesh.position.set(px, py, pz); mesh.castShadow = true; g.add(mesh); }
    for (const sx of [-.21, .21]) for (const sz of [-.19, .19]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .5, 8), darkWood); leg.position.set(sx, .25, sz); g.add(leg); }
    obstacles.push({ x, z, halfX: .3, halfZ: .3 });
  }
  chair(-22.8, 1.95, 0); chair(-20.4, 1.95, 0); chair(-22.8, 4.25, Math.PI); chair(-20.4, 4.25, Math.PI);

  // A leather armchair and floor lamp in the south-west corner.
  const armchair = new THREE.Group(); armchair.position.set(-27.9, 0, -1.5); armchair.rotation.y = Math.PI / 4; wing.add(armchair);
  for (const [w, h, d, x, y, z] of [[1.1, .36, .95, 0, .38, 0], [1.15, .9, .26, 0, .82, -.42], [.22, .55, .95, -.53, .62, 0], [.22, .55, .95, .53, .62, 0]]) { const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, .07), leather); mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; armchair.add(mesh); }
  obstacles.push({ x: -27.9, z: -1.5, halfX: .75, halfZ: .75 });
  cylinder(-29.3, .03, -2.8, .2, .22, .06, brass); cylinder(-29.3, 1.1, -2.8, .018, .018, 2.1, brass);
  const shade = cylinder(-29.3, 2.15, -2.8, .2, .34, .36, new THREE.MeshStandardMaterial({ color: "#e8d3a8", roughness: .9, side: THREE.DoubleSide, emissive: "#ffcb87", emissiveIntensity: .35 }), 24); shade.castShadow = false;
  obstacles.push({ x: -29.3, z: -2.8, halfX: .22, halfZ: .22 });

  // The newest articles hang on the west wall as framed broadsheets.
  const posts = exhibits.filter(item => item.room === "blog" && item.post).slice(0, 3);
  const slots = [6.3, 3.3, .3];
  const frameFor = () => new THREE.MeshStandardMaterial({ color: PALETTE.gold, metalness: .45, roughness: .32, emissive: "#ffc861", emissiveIntensity: 0 });
  const loading: Promise<void>[] = [];
  posts.forEach((exhibit, index) => {
    const z = slots[index], frame = frameFor();
    const group = new THREE.Group(); group.position.set(-30.12, 0, z); group.rotation.y = Math.PI / 2; scene.add(group);
    const backing = new THREE.Mesh(new THREE.BoxGeometry(2.46, 3.08, .06), frame); backing.position.set(0, 2.85, 0); group.add(backing);
    const material = new THREE.MeshBasicMaterial({ map: keep(titleTexture(exhibit.title, exhibit.subtitle, exhibit.description, `${index + 1}`.padStart(2, "0"))), toneMapped: false });
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.24, 2.8), material); panel.position.set(0, 2.85, .04); panel.userData.exhibitId = exhibit.id; group.add(panel); targets.push(panel);
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(1.1, .06, .14), brass); lamp.position.set(0, 4.55, .16); group.add(lamp);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(1, .02, .02), bulb); strip.position.set(0, 4.51, .22); group.add(strip);
    displays.push({ id: exhibit.id, position: new THREE.Vector3(-30.1, 0, z), reach: 3.3, frame });
    if (exhibit.image) loading.push(loadImage(textureSource(exhibit.image)).then(image => {
      if (!image || signal.aborted) return;
      material.map?.dispose(); material.map = keep(coverTexture(image, exhibit.title, exhibit.subtitle, `${index + 1}`.padStart(2, "0"), "Read the article")); material.needsUpdate = true;
    }));
  });

  // The reading desk: a lectern holding the index of every article.
  const index = exhibits.find(item => item.postIndex);
  if (index) {
    const frame = frameFor(), width = 1.7;
    const group = new THREE.Group(); group.position.set(-17.4, 0, 7.1); group.rotation.y = Math.PI; scene.add(group);
    const part = (size: [number, number, number], pos: [number, number, number], material: THREE.Material, parent: THREE.Object3D = group) => {
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 2, .018), material); mesh.position.set(...pos); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
    };
    const base = part([width, .92, 1], [0, .46, 0], marble); base.userData.exhibitId = index.id; targets.push(base);
    part([width + .12, .08, 1.1], [0, .06, 0], frame);
    const stand = new THREE.Group(); stand.position.set(0, .96, -.18); stand.rotation.x = -.3; group.add(stand);
    part([width - .1, width * .78, .07], [0, width * .39, -.04], frame, stand);
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width - .22, width * .7), new THREE.MeshBasicMaterial({ map: keep(titleTexture(index.title, index.subtitle, index.description, "")), toneMapped: false }));
    panel.position.set(0, width * .39, .005); panel.userData.exhibitId = index.id; stand.add(panel); targets.push(panel);
    obstacles.push({ x: -17.4, z: 7.1, halfX: width / 2 + .1, halfZ: .62 });
    displays.push({ id: index.id, position: new THREE.Vector3(-17.4, 0, 7.1), reach: 2.8, frame });
  }

  // Light: a pendant over the table, a wash on the article wall, the corner lamp.
  cylinder(-21.6, 5.5, 3.1, .012, .012, 2.2, brass);
  const pendant = cylinder(-21.6, 4.3, 3.1, .12, .55, .4, new THREE.MeshStandardMaterial({ color: PALETTE.gold, metalness: .45, roughness: .35, side: THREE.DoubleSide }), 28); pendant.castShadow = false;
  const pendantBulb = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8), bulb); pendantBulb.position.set(-21.6, 4.1, 3.1); scene.add(pendantBulb);
  const table = new THREE.PointLight("#ffd29a", mobile ? 16 : 22, 11, 1.6); table.position.set(-21.6, 3.95, 3.1); scene.add(table);
  const wash = new THREE.SpotLight("#ffcb88", mobile ? 36 : 50, 13, .7, .7, 1.6); wash.position.set(-24.5, 6, 3.1); wash.target.position.set(-30.1, 2.6, 3.1); scene.add(wash, wash.target);
  const corner = new THREE.PointLight("#ffc77d", 10, 6, 2); corner.position.set(-29.3, 2.05, -2.8); scene.add(corner);

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
    obstacles, targets, displays, loading,
    setLights(on: boolean) { lightTarget = on ? 1 : 0; },
    setFocus(id: string | null) { displays.forEach(display => { display.frame.emissiveIntensity = display.id === id ? .2 : 0; }); },
    update(delta: number, reduced: boolean) {
      lightAmount = reduced ? lightTarget : THREE.MathUtils.damp(lightAmount, lightTarget, 10, delta);
      table.intensity = (mobile ? 16 : 22) * (.2 + lightAmount * .8);
      wash.intensity = (mobile ? 36 : 50) * (.15 + lightAmount * .85);
      corner.intensity = 10 * (.3 + lightAmount * .7);
    },
    dispose() { textures.forEach(texture => texture.dispose()); },
  };
}

export function inLibrary(x: number, z: number) {
  return x >= LIBRARY_BOUNDS.minX && x <= LIBRARY_BOUNDS.maxX && z >= LIBRARY_BOUNDS.minZ && z <= LIBRARY_BOUNDS.maxZ;
}
export function inLibraryDoor(x: number, z: number) {
  return x >= LIBRARY_DOOR.minX && x <= LIBRARY_DOOR.maxX && z >= LIBRARY_DOOR.minZ && z <= LIBRARY_DOOR.maxZ;
}
