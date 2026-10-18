import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { PALETTE, canvasTexture, coverTexture, kioskTexture, loadImage, roundRugTexture, titleTexture } from "./materials";
import type { MuseumExhibit, MuseumRoom } from "./types";
import type { Obstacle } from "./environment";

export type ExhibitDisplay = { exhibit: MuseumExhibit; group: THREE.Group; position: THREE.Vector3; frame: THREE.MeshStandardMaterial };

// Museum plan: an entrance foyer, then two galleries split by the arches
// (z 5 and -11) with cases along the side walls, so the central aisle stays
// open from the doors to the apse. Contact closes the axis as a low desk.
//   Gallery 1: Selected work (west) / Showcase (east)
//   Gallery 2: About (west, beside the studio door) / Process (east)
export const EXHIBIT_SLOTS: Record<MuseumRoom, [number, number, number][]> = {
  work: [[-8.6, 1.6, Math.PI / 2], [-8.6, -3.4, Math.PI / 2], [-8.6, -8.4, Math.PI / 2]],
  playground: [[8.6, 1.6, -Math.PI / 2], [8.6, -3.4, -Math.PI / 2], [8.6, -8.4, -Math.PI / 2]],
  about: [[-8.6, -18, Math.PI / 2], [-8.6, -22.6, Math.PI / 2], [-8.6, -27.2, Math.PI / 2]],
  process: [[8.6, -18, -Math.PI / 2], [8.6, -22.6, -Math.PI / 2], [8.6, -27.2, -Math.PI / 2]],
  contact: [[0, -26.6, 0]],
  blog: [],
  studio: [],
};
// The catalogue of all work is a reading lectern in the foyer, by the doorkeeper.
const COLLECTION: [number, number, number] = [-4.4, 8.4, Math.PI / 2];
const CASE_SCALE = .82;

export function createMuseumExhibits(scene: THREE.Scene, exhibits: MuseumExhibit[], marble: THREE.Material, signal: AbortSignal) {
  const displays: ExhibitDisplay[] = [], targets: THREE.Object3D[] = [], obstacles: Obstacle[] = [];
  const counters: Partial<Record<MuseumRoom, number>> = {}, totals: Partial<Record<MuseumRoom, number>> = {};
  for (const exhibit of exhibits) if (!exhibit.secret && exhibit.id !== "work-collection") totals[exhibit.room] = (totals[exhibit.room] ?? 0) + 1;
  // A gallery with fewer pieces than slots keeps them centred on its wall (and its spotlight).
  function slotFor(room: MuseumRoom, index: number): [number, number, number] | undefined {
    const slots = EXHIBIT_SLOTS[room], count = Math.min(totals[room] ?? 0, slots.length);
    if (index >= count) return undefined;
    if (count === slots.length || slots.length < 3) return slots[index];
    const [x, z, rotation] = slots[1], step = slots[0][1] - slots[1][1];
    return [x, z + ((count - 1) / 2 - index) * step, rotation];
  }
  const loading: Promise<void>[] = [];
  const warm = new THREE.MeshBasicMaterial({ color: new THREE.Color("#e8b26d").multiplyScalar(1.7), toneMapped: false });
  const glass = new THREE.MeshPhysicalMaterial({ color: "#e3f4ff", roughness: .07, metalness: .02, clearcoat: 1, transparent: true, opacity: .075, side: THREE.DoubleSide, depthWrite: false });
  // Every case stands on a purple rug behind a gold-and-red velvet rope.
  const rugMap = roundRugTexture();
  const rug = new THREE.MeshStandardMaterial({ map: rugMap, transparent: true, roughness: .95 });
  const post = new THREE.MeshStandardMaterial({ color: PALETTE.gold, metalness: .45, roughness: .3, emissive: "#7a4a06", emissiveIntensity: .25 });
  const pearl = new THREE.MeshStandardMaterial({ color: "#fff3e6", roughness: .35 });
  const rope = new THREE.MeshStandardMaterial({ color: PALETTE.red, roughness: .7 });
  const postGeometry = new THREE.CylinderGeometry(.045, .07, 1.05, 14), footGeometry = new THREE.CylinderGeometry(.2, .24, .07, 20), knobGeometry = new THREE.SphereGeometry(.1, 16, 12);
  // The ropes and rugs of every case are merged into one mesh per material at the end.
  const dressing = new Map<THREE.Material, THREE.BufferGeometry[]>();
  function dress(parent: THREE.Group, geometry: THREE.BufferGeometry, material: THREE.Material, matrix: THREE.Matrix4) {
    parent.updateMatrixWorld(true);
    const placed = (geometry.index ? geometry.toNonIndexed() : geometry.clone()).applyMatrix4(new THREE.Matrix4().multiplyMatrices(parent.matrixWorld, matrix));
    dressing.set(material, [...dressing.get(material) ?? [], placed]);
  }
  function stanchion(parent: THREE.Group, x: number, z: number) {
    for (const [geometry, material, y] of [[footGeometry, post, .035], [postGeometry, post, .56], [knobGeometry, pearl, 1.15]] as [THREE.BufferGeometry, THREE.Material, number][]) {
      dress(parent, geometry, material, new THREE.Matrix4().makeTranslation(x, y, z));
    }
  }
  function velvetRope(parent: THREE.Group, from: number, to: number, z: number) {
    const sag = new THREE.QuadraticBezierCurve3(new THREE.Vector3(from, 1.02, z), new THREE.Vector3((from + to) / 2, .62, z), new THREE.Vector3(to, 1.02, z));
    const tube = new THREE.TubeGeometry(sag, 20, .035, 8); dress(parent, tube, rope, new THREE.Matrix4()); tube.dispose();
  }
  function box(parent: THREE.Group, size: [number, number, number], pos: [number, number, number], material: THREE.Material, rounded = false) {
    const mesh = new THREE.Mesh(rounded ? new RoundedBoxGeometry(...size, 2, .018) : new THREE.BoxGeometry(...size), material);
    mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  for (const exhibit of exhibits) {
    if (exhibit.secret) continue;
    const lectern = exhibit.id === "work-collection" || exhibit.room === "contact";
    const index = exhibit.id === "work-collection" ? 0 : counters[exhibit.room] ?? 0;
    if (exhibit.id !== "work-collection") counters[exhibit.room] = index + 1;
    const slot = exhibit.id === "work-collection" ? COLLECTION : slotFor(exhibit.room, index); if (!slot) continue;
    const [x, z, rotation] = slot;
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = rotation; scene.add(group);
    const frame = new THREE.MeshStandardMaterial({ color: PALETTE.gold, metalness: .45, roughness: .32, emissive: "#ffc861", emissiveIntensity: 0 });
    const panelMap = exhibit.form ? kioskTexture(exhibit.title, exhibit.subtitle) : titleTexture(exhibit.title, exhibit.subtitle, exhibit.description, `${index + 1}`.padStart(2, "0"));
    const panelMat = new THREE.MeshBasicMaterial({ map: panelMap, toneMapped: false });
    const plaque = canvasTexture(1024, 256, ctx => {
      ctx.fillStyle = PALETTE.ink; ctx.font = "bold 52px Georgia"; ctx.textAlign = "center"; ctx.fillText(exhibit.title, 512, 108);
      ctx.fillStyle = PALETTE.red; ctx.font = "bold 28px Arial"; ctx.fillText(exhibit.action, 512, 177);
    });
    const labelMat = new THREE.MeshBasicMaterial({ map: plaque, transparent: true, toneMapped: false });
    if (lectern) {
      // A low plinth with a tilted reading panel: it never blocks the view past it.
      const width = exhibit.room === "contact" ? 2.5 : 1.7;
      const base = box(group, [width, .92, 1], [0, .46, 0], marble, true); base.userData.exhibitId = exhibit.id; targets.push(base);
      box(group, [width + .12, .08, 1.1], [0, .06, 0], frame);
      // A glowing seam under a marble cap: an edge of light, not a lit slab.
      box(group, [width - .04, .04, .96], [0, .94, 0], warm);
      box(group, [width, .03, 1], [0, .975, 0], marble, true);
      const stand = new THREE.Group(); stand.position.set(0, .96, -.18); stand.rotation.x = -.3; group.add(stand);
      box(stand, [width - .1, width * .78, .07], [0, width * .39, -.04], frame);
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(width - .22, width * .7), panelMat);
      panel.position.set(0, width * .39, .005); panel.userData.exhibitId = exhibit.id; stand.add(panel); targets.push(panel);
      const label = new THREE.Mesh(new THREE.PlaneGeometry(width * .82, width * .2), labelMat);
      label.position.set(0, .5, .505); label.userData.exhibitId = exhibit.id; group.add(label); targets.push(label);
      const half = [width / 2 + .1, .62];
      obstacles.push({ x, z, halfX: rotation ? half[1] : half[0], halfZ: rotation ? half[0] : half[1] });
    } else {
      group.scale.setScalar(CASE_SCALE);
      const base = box(group, [3.6, .98, 1.58], [0, .5, 0], marble, true);
      base.userData.exhibitId = exhibit.id; targets.push(base);
      box(group, [3.74, .1, 1.7], [0, .08, 0], frame);
      box(group, [3.65, .045, 1.66], [0, 1.01, 0], warm);
      box(group, [3.47, .14, 1.44], [0, 1.12, 0], frame);
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.84, 3.55), panelMat);
      panel.position.set(0, 3.05, .39); panel.userData.exhibitId = exhibit.id; group.add(panel); targets.push(panel);
      const glazing = box(group, [3.21, 3.91, 1.22], [0, 3.16, 0], glass);
      glazing.castShadow = false;
      for (const xx of [-1.61, 1.61]) for (const zz of [-.61, .61]) box(group, [.023, 3.96, .023], [xx, 3.16, zz], frame);
      for (const yy of [1.18, 5.14]) {
        for (const zz of [-.61, .61]) box(group, [3.25, .027, .027], [0, yy, zz], frame);
        for (const xx of [-1.61, 1.61]) box(group, [.027, .027, 1.25], [xx, yy, 0], frame);
      }
      const label = new THREE.Mesh(new THREE.PlaneGeometry(3.12, .78), labelMat);
      label.position.set(0, .56, .8); label.userData.exhibitId = exhibit.id; group.add(label); targets.push(label);
      const disc = new THREE.CircleGeometry(1, 48);
      dress(group, disc, rug, new THREE.Matrix4().compose(new THREE.Vector3(0, .03 / CASE_SCALE, .25), new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), new THREE.Vector3(2.75, 1.85, 1)));
      disc.dispose();
      for (const xx of [-2.1, 0, 2.1]) stanchion(group, xx, 1.55);
      velvetRope(group, -2.1, 0, 1.55); velvetRope(group, 0, 2.1, 1.55);
      const long = 2.2 * CASE_SCALE, short = 1.4 * CASE_SCALE;
      obstacles.push({ x, z, halfX: rotation ? short : long, halfZ: rotation ? long : short });
    }
    displays.push({ exhibit, group, position: new THREE.Vector3(x, 0, z), frame });
    if (exhibit.image) loading.push(loadImage(exhibit.image).then(image => {
      if (!image || signal.aborted) return;
      const map = coverTexture(image, exhibit.title, exhibit.subtitle, `${index + 1}`.padStart(2, "0"));
      panelMat.map?.dispose(); panelMat.map = map; panelMat.needsUpdate = true;
    }));
  }
  for (const [material, geometries] of dressing) {
    const merged = mergeGeometries(geometries, false); geometries.forEach(geometry => geometry.dispose());
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, material); mesh.castShadow = material !== rug; mesh.receiveShadow = true; scene.add(mesh);
  }
  [postGeometry, footGeometry, knobGeometry].forEach(geometry => geometry.dispose());
  return { displays, targets, obstacles, loading };
}
