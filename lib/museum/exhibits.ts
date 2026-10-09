import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { canvasTexture, coverTexture, loadImage, titleTexture } from "./materials";
import type { MuseumExhibit, MuseumRoom } from "./types";
import type { Obstacle } from "./environment";

export type ExhibitDisplay = { exhibit: MuseumExhibit; group: THREE.Group; position: THREE.Vector3; frame: THREE.MeshStandardMaterial };

const slots: Record<MuseumRoom, [number, number, number][]> = {
  work: [[-7.5, -7.7, 0], [-2.5, -7.7, 0], [2.5, -7.7, 0], [7.5, -7.7, 0]],
  process: [[-7, -25, 0], [-2, -25, 0], [3, -25, 0]],
  playground: [[8.7, 5.3, -Math.PI / 2], [8.7, .2, -Math.PI / 2], [8.7, -4.9, -Math.PI / 2]],
  about: [[-8.7, 5.3, Math.PI / 2], [-8.7, .2, Math.PI / 2], [-8.7, -4.9, Math.PI / 2]],
  contact: [[8.2, -25, 0]],
};

export function createMuseumExhibits(scene: THREE.Scene, exhibits: MuseumExhibit[], marble: THREE.Material, signal: AbortSignal) {
  const displays: ExhibitDisplay[] = [], targets: THREE.Object3D[] = [], obstacles: Obstacle[] = [];
  const counters: Partial<Record<MuseumRoom, number>> = {};
  const loading: Promise<void>[] = [];
  const warm = new THREE.MeshBasicMaterial({ color: new THREE.Color("#edc788").multiplyScalar(2.4), toneMapped: false });
  const glass = new THREE.MeshPhysicalMaterial({ color: "#e4c790", roughness: .07, metalness: .02, clearcoat: 1, transparent: true, opacity: .075, side: THREE.DoubleSide, depthWrite: false });
  function box(parent: THREE.Group, size: [number, number, number], pos: [number, number, number], material: THREE.Material, rounded = false) {
    const mesh = new THREE.Mesh(rounded ? new RoundedBoxGeometry(...size, 2, .018) : new THREE.BoxGeometry(...size), material);
    mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  for (const exhibit of exhibits) {
    const index = counters[exhibit.room] ?? 0;
    counters[exhibit.room] = index + 1;
    const slot = slots[exhibit.room][index]; if (!slot) continue;
    const [x, z, rotation] = slot;
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = rotation; scene.add(group);
    const frame = new THREE.MeshStandardMaterial({ color: "#a17b42", metalness: .78, roughness: .32, emissive: "#bd8b48", emissiveIntensity: 0 });
    const base = box(group, [3.6, .98, 1.58], [0, .5, 0], marble, true);
    base.userData.exhibitId = exhibit.id; targets.push(base);
    box(group, [3.74, .1, 1.7], [0, .08, 0], frame);
    box(group, [3.65, .045, 1.66], [0, 1.01, 0], warm);
    box(group, [3.47, .14, 1.44], [0, 1.12, 0], frame);
    const panelMap = titleTexture(exhibit.title, exhibit.subtitle, exhibit.description, `${index + 1}`.padStart(2, "0"));
    const panelMat = new THREE.MeshBasicMaterial({ map: panelMap, toneMapped: false });
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.84, 3.55), panelMat);
    panel.position.set(0, 3.05, .39); panel.userData.exhibitId = exhibit.id; group.add(panel); targets.push(panel);
    const glazing = box(group, [3.21, 3.91, 1.22], [0, 3.16, 0], glass);
    glazing.castShadow = false;
    for (const xx of [-1.61, 1.61]) for (const zz of [-.61, .61]) box(group, [.023, 3.96, .023], [xx, 3.16, zz], frame);
    for (const yy of [1.18, 5.14]) {
      for (const zz of [-.61, .61]) box(group, [3.25, .027, .027], [0, yy, zz], frame);
      for (const xx of [-1.61, 1.61]) box(group, [.027, .027, 1.25], [xx, yy, 0], frame);
    }
    const plaque = canvasTexture(1024, 256, ctx => {
      ctx.fillStyle = "#e2c69a"; ctx.font = "52px Georgia"; ctx.textAlign = "center"; ctx.fillText(exhibit.title, 512, 108);
      ctx.fillStyle = "#a99a80"; ctx.font = "28px Arial"; ctx.fillText(exhibit.action, 512, 177);
    });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(3.12, .78), new THREE.MeshBasicMaterial({ map: plaque, transparent: true, toneMapped: false }));
    label.position.set(0, .56, .8); label.userData.exhibitId = exhibit.id; group.add(label); targets.push(label);
    displays.push({ exhibit, group, position: new THREE.Vector3(x, 0, z), frame });
    obstacles.push({ x, z, halfX: rotation ? .91 : 1.94, halfZ: rotation ? 1.94 : .91 });
    if (exhibit.image) loading.push(loadImage(exhibit.image).then(image => {
      if (!image || signal.aborted) return;
      const map = coverTexture(image, exhibit.title, exhibit.subtitle, `${index + 1}`.padStart(2, "0"));
      panelMat.map?.dispose(); panelMat.map = map; panelMat.needsUpdate = true;
    }));
  }
  return { displays, targets, obstacles, loading };
}
