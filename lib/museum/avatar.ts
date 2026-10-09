import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { canvasTexture } from "./materials";

/** A small, fully articulated museum visitor. Native geometry keeps it local
 * and lightweight; no third-party character service or remote avatar is used. */
export function createMuseumAvatar() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const knit = new THREE.MeshStandardMaterial({ color: "#252523", roughness: .96 });
  const trousers = new THREE.MeshStandardMaterial({ color: "#282726", roughness: .95 });
  const leather = new THREE.MeshStandardMaterial({ color: "#372c22", roughness: .62 });
  const skin = new THREE.MeshStandardMaterial({ color: "#c49570", roughness: .8 });
  const hair = new THREE.MeshStandardMaterial({ color: "#211c17", roughness: .9 });
  const brass = new THREE.MeshStandardMaterial({ color: "#b49157", metalness: .75, roughness: .33 });
  const white = new THREE.MeshStandardMaterial({ color: "#cfc6b8", roughness: .88 });
  const frame = new THREE.MeshStandardMaterial({ color: "#211d1b", metalness: .55, roughness: .34 });
  const eyes = new THREE.MeshStandardMaterial({ color: "#302923", roughness: .3 });

  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Group, pos: [number, number, number], scale?: [number, number, number]) {
    const result = new THREE.Mesh(geometry, material);
    result.position.set(...pos);
    if (scale) result.scale.set(...scale);
    result.castShadow = true;
    parent.add(result);
    return result;
  }
  const sphere = (parent: THREE.Group, material: THREE.Material, pos: [number, number, number], scale: [number, number, number]) => mesh(new THREE.SphereGeometry(1, 20, 16), material, parent, pos, scale);
  const box = (parent: THREE.Group, material: THREE.Material, pos: [number, number, number], size: [number, number, number], radius = .04) => mesh(new RoundedBoxGeometry(...size, 3, radius), material, parent, pos);

  mesh(new THREE.CapsuleGeometry(.24, .32, 8, 16), knit, body, [0, 1.31, 0], [1, 1, .68]);
  box(body, trousers, [0, .9, 0], [.41, .3, .26], .09);
  const collar = mesh(new THREE.TorusGeometry(.14, .044, 8, 24), white, body, [0, 1.63, .005]);
  collar.rotation.x = Math.PI / 2;
  sphere(body, knit, [0, 1.57, -.12], [.25, .18, .18]);
  mesh(new THREE.CylinderGeometry(.08, .09, .18, 16), skin, body, [0, 1.68, .02]);

  const head = new THREE.Group();
  head.position.set(0, 1.98, .015);
  body.add(head);
  sphere(head, skin, [0, 0, 0], [.265, .31, .245]);
  sphere(head, skin, [-.263, -.014, -.014], [.058, .09, .049]);
  sphere(head, skin, [.263, -.014, -.014], [.058, .09, .049]);
  sphere(head, skin, [0, -.028, .241], [.041, .055, .059]);
  for (const side of [-1, 1]) {
    sphere(head, white, [side * .107, .021, .226], [.06, .073, .026]);
    sphere(head, eyes, [side * .107, .022, .25], [.027, .039, .014]);
    sphere(head, white, [side * .099, .036, .263], [.008, .01, .005]);
    const rim = mesh(new THREE.TorusGeometry(.093, .009, 8, 28), frame, head, [side * .112, .027, .261]);
    rim.scale.y = 1.04;
    box(head, frame, [side * .211, .028, .146], [.013, .012, .22], .005);
    const brow = box(head, hair, [side * .103, .117, .235], [.1, .018, .014], .008);
    brow.rotation.z = side * -.1;
  }
  box(head, frame, [0, .035, .275], [.054, .012, .01], .005);
  const smile = mesh(new THREE.TorusGeometry(.049, .004, 6, 16, Math.PI * .72), leather, head, [0, -.114, .229]);
  smile.rotation.z = Math.PI * 1.14;
  sphere(head, hair, [0, .18, -.027], [.273, .18, .24]);
  for (let i = 0; i < 11; i++) {
    const t = i / 10;
    const lock = sphere(head, hair, [-.21 + t * .41, .22 + Math.sin(t * Math.PI) * .055, .12 - t * .05], [.09, .12, .18]);
    lock.rotation.z = -.48 + t * .55;
    lock.rotation.x = -.15;
  }
  sphere(head, hair, [-.223, .097, .019], [.065, .12, .11]);

  const legs: THREE.Group[] = [], arms: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(side * .12, .86, 0); body.add(leg); legs.push(leg);
    mesh(new THREE.CapsuleGeometry(.092, .48, 7, 12), trousers, leg, [0, -.31, 0]);
    box(leg, white, [0, -.77, .07], [.25, .075, .4], .04);
    sphere(leg, white, [0, -.705, .09], [.124, .094, .184]);
    for (let i = 0; i < 3; i++) box(leg, knit, [0, -.65, .045 + i * .035], [.1, .009, .012], .003);
    const arm = new THREE.Group(); arm.position.set(side * .267, 1.5, 0); body.add(arm); arms.push(arm);
    const sleeve = mesh(new THREE.CapsuleGeometry(.095, .33, 7, 12), knit, arm, [side * .021, -.22, .015]);
    sleeve.rotation.z = side * .07;
    sphere(arm, skin, [side * .035, -.48, .021], [.065, .095, .068]);
    box(body, leather, [side * .16, 1.36, .132], [.044, .57, .018], .008);
  }
  box(body, leather, [0, 1.29, -.272], [.42, .53, .2], .07);
  box(body, leather, [0, 1.3, -.38], [.39, .27, .09], .04);
  for (const side of [-1, 1]) {
    box(body, leather, [side * .116, 1.21, -.433], [.028, .19, .02], .007);
    box(body, brass, [side * .116, 1.2, -.446], [.043, .042, .01], .005);
  }
  const monogram = canvasTexture(128, 128, ctx => { ctx.fillStyle = "#b49157"; ctx.font = "76px Georgia"; ctx.textAlign = "center"; ctx.fillText("h", 64, 94); });
  const mark = new THREE.Mesh(new THREE.PlaneGeometry(.11, .11), new THREE.MeshBasicMaterial({ map: monogram, transparent: true, side: THREE.DoubleSide, toneMapped: false }));
  mark.position.set(0, 1.18, -.433); mark.rotation.y = Math.PI; body.add(mark);
  const handle = mesh(new THREE.TorusGeometry(.076, .013, 8, 20, Math.PI), leather, body, [0, 1.61, -.25]);
  handle.scale.y = .75;

  return {
    root,
    update(time: number, speed: number, reduced: boolean) {
      const stride = Math.min(1, speed / 2.4);
      const wave = Math.sin(time * (speed > 3 ? 11 : 7));
      legs[0].rotation.x = wave * .47 * stride;
      legs[1].rotation.x = -wave * .47 * stride;
      arms[0].rotation.x = -wave * .37 * stride;
      arms[1].rotation.x = wave * .37 * stride;
      body.position.y = reduced ? 0 : Math.abs(wave) * .035 * stride;
      head.rotation.y = reduced || speed > .1 ? 0 : Math.sin(time * .4) * .07;
    },
  };
}
