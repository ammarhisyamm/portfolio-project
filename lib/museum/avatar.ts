import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { canvasTexture, haloTexture } from "./materials";
import { curlLock, faceDepth, hairLock, sculptedFace, sculptedHairBase, sneakerPart, sneakerUpper, sneakerWidth, tailoredLimb } from "./avatar-geometry";

/** A real articulated mesh. The v4 turnaround and pose sheets supply art
 * direction (curly hair, round glasses, black knit over a white shirt, dark
 * cargo trousers, cream retro runners, brown leather backpack), not a rigged
 * GLB. Geometry and animation stay local and fully three-dimensional. */
export function createMuseumAvatar(knitMap?: THREE.Texture) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  root.name = "Hisyam"; body.name = "Body";
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(.92, .68), new THREE.MeshBasicMaterial({ map: haloTexture(), color: "#100c07", transparent: true, opacity: .36, depthWrite: false, toneMapped: false }));
  contact.rotation.x = -Math.PI / 2; contact.position.set(0, .028, .02); root.add(contact);
  const textile = knitMap ?? canvasTexture(256, 256, ctx => {
    ctx.fillStyle = "#777"; ctx.fillRect(0, 0, 256, 256); ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1.3;
    for (let y = 0; y < 256; y += 8) for (let x = 0; x < 256; x += 6) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3, y + 5); ctx.lineTo(x + 6, y); ctx.stroke(); }
  });
  textile.colorSpace = THREE.NoColorSpace; textile.wrapS = textile.wrapT = THREE.RepeatWrapping; textile.repeat.set(4, 4);
  // Vertical ribbing for hems, cuffs and the crew neck.
  const ribMap = canvasTexture(64, 64, ctx => { for (let x = 0; x < 64; x += 8) { const g = ctx.createLinearGradient(x, 0, x + 8, 0); g.addColorStop(0, "#555"); g.addColorStop(.5, "#bbb"); g.addColorStop(1, "#555"); ctx.fillStyle = g; ctx.fillRect(x, 0, 8, 64); } });
  ribMap.colorSpace = THREE.NoColorSpace; ribMap.wrapS = ribMap.wrapT = THREE.RepeatWrapping; ribMap.repeat.set(14, 1);
  const knit = new THREE.MeshPhysicalMaterial({ color: "#1d1b1a", roughness: .97, bumpMap: textile, bumpScale: .006, sheen: .35, sheenColor: "#5d5a56", sheenRoughness: .85 });
  const rib = new THREE.MeshStandardMaterial({ color: "#171615", roughness: .95, bumpMap: ribMap, bumpScale: .01 });
  const trousers = new THREE.MeshStandardMaterial({ color: "#2b2622", roughness: .95, bumpMap: textile, bumpScale: .0015 });
  const seam = new THREE.MeshStandardMaterial({ color: "#1c1916", roughness: .96 });
  const shirt = new THREE.MeshStandardMaterial({ color: "#ece9e2", roughness: .82, side: THREE.DoubleSide });
  const leather = new THREE.MeshStandardMaterial({ color: "#3a2519", roughness: .55, metalness: .05 });
  const darkLeather = new THREE.MeshStandardMaterial({ color: "#26180f", roughness: .6, metalness: .04 });
  const stitch = new THREE.MeshStandardMaterial({ color: "#a07a4a", roughness: .7 });
  const pores = canvasTexture(128, 128, ctx => {
    ctx.fillStyle = "#888"; ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 1800; i++) { ctx.fillStyle = i % 2 ? "#999" : "#777"; ctx.fillRect((i * 73) % 128, (i * 37 + Math.floor(i / 128) * 11) % 128, 1, 1); }
  });
  pores.colorSpace = THREE.NoColorSpace;
  const skin = new THREE.MeshPhysicalMaterial({ color: "#c99b7e", roughness: .66, bumpMap: pores, bumpScale: .00035, sheen: .08, sheenColor: "#e2c2ac" });
  const faceSkin = skin.clone(); faceSkin.color.set("#ffffff"); faceSkin.vertexColors = true;
  const nostril = new THREE.MeshStandardMaterial({ color: "#6e4a3d", roughness: .8 });
  const lip = new THREE.MeshStandardMaterial({ color: "#a66f62", roughness: .7 });
  const hair = new THREE.MeshPhysicalMaterial({ color: "#141211", roughness: .5, sheen: .45, sheenColor: "#4a3f36", sheenRoughness: .55 });
  const hairShade = new THREE.MeshStandardMaterial({ color: "#0d0c0c", roughness: .7 });
  const brass = new THREE.MeshStandardMaterial({ color: "#c0913f", metalness: .9, roughness: .28 });
  const white = new THREE.MeshStandardMaterial({ color: "#e0dfd7", roughness: .83 });
  const canvasUpper = new THREE.MeshStandardMaterial({ color: "#e4ddcf", roughness: .86 });
  const suede = new THREE.MeshStandardMaterial({ color: "#bdb5a7", roughness: .98 });
  const midsole = new THREE.MeshStandardMaterial({ color: "#ece8de", roughness: .9 });
  const outsole = new THREE.MeshStandardMaterial({ color: "#3b3936", roughness: .95 });
  const frame = new THREE.MeshStandardMaterial({ color: "#2b2520", metalness: .75, roughness: .24 });
  const iris = new THREE.MeshStandardMaterial({ color: "#2e1f17", roughness: .42 });
  const pupil = new THREE.MeshStandardMaterial({ color: "#090b0d", roughness: .28 });
  const nLogo = canvasTexture(128, 128, ctx => {
    ctx.translate(64, 64); ctx.transform(1, 0, -.28, 1, 0, 0);
    ctx.font = "bold 108px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.lineWidth = 9; ctx.strokeStyle = "#e8e4da"; ctx.strokeText("N", 0, 4); ctx.fillStyle = "#2c3038"; ctx.fillText("N", 0, 4);
  });
  const logo = new THREE.MeshStandardMaterial({ map: nLogo, transparent: true, roughness: .8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  type XYZ = [number, number, number];
  function mesh(g: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, pos: XYZ, scale?: XYZ) {
    const m = new THREE.Mesh(g, material); m.position.set(...pos); if (scale) m.scale.set(...scale);
    m.castShadow = m.receiveShadow = true; parent.add(m); return m;
  }
  const sphere = (p: THREE.Object3D, m: THREE.Material, pos: XYZ, s: XYZ) => mesh(new THREE.SphereGeometry(1, 18, 12), m, p, pos, s);
  const box = (p: THREE.Object3D, m: THREE.Material, pos: XYZ, s: XYZ, radius = .015) => mesh(new RoundedBoxGeometry(...s, 2, radius), m, p, pos);
  function tube(p: THREE.Object3D, m: THREE.Material, points: XYZ[], radius: number, closed = false) {
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(v => new THREE.Vector3(...v)), closed), 24, radius, 6, closed), m, p, [0, 0, 0]);
  }
  const cuff = (p: THREE.Object3D, m: THREE.Material, y: number, r: number, h: number) => mesh(new THREE.CylinderGeometry(r, r, h, 24), m, p, [0, y, 0]);
  const strap = (p: THREE.Object3D, m: THREE.Material, points: XYZ[], width: number, depth: number) => mesh(hairLock(points, width, depth), m, p, [0, 0, 0]);
  // Square brass buckle: a four-sided ring with a centre prong.
  function buckle(p: THREE.Object3D, pos: XYZ, size: number, rotation: XYZ = [0, 0, 0]) {
    const g = new THREE.Group(); g.position.set(...pos); g.rotation.set(...rotation); p.add(g);
    const ring = mesh(new THREE.TorusGeometry(size * .7, size * .13, 5, 4), brass, g, [0, 0, 0]); ring.rotation.z = Math.PI / 4; ring.scale.set(1, 1.18, 1);
    box(g, brass, [0, 0, size * .1], [size * .12, size * 1.05, size * .1], size * .04);
    return g;
  }

  // Torso: rounded sloping shoulders, chunky knit, white shirt hem and collar.
  const profile = [[.212, 1.12], [.236, 1.17], [.23, 1.29], [.246, 1.47], [.262, 1.6], [.258, 1.67], [.232, 1.725], [.17, 1.775], [.112, 1.805]];
  mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 40), knit, body, [0, 0, 0], [1, 1, .67]);
  mesh(new THREE.CylinderGeometry(.226, .218, .085, 40, 1, true), rib, body, [0, 1.152, 0], [1, 1, .68]);
  mesh(new THREE.CylinderGeometry(.214, .228, .058, 40, 1, true), shirt, body, [0, 1.088, 0], [1, 1, .68]);
  // Pelvis is a tapered lathe, so the trousers flow out of the shirt hem.
  mesh(new THREE.LatheGeometry([[0, .9], [.09, .905], [.17, .945], [.205, 1.0], [.214, 1.1]].map(([r, y]) => new THREE.Vector2(r, y)), 36), trousers, body, [0, 0, 0], [1, 1, .66]);
  for (const s of [-1, 1]) { tube(body, seam, [[s * .19, 1.07, .07], [s * .15, 1.03, .1], [s * .13, .96, .1]], .003); box(body, trousers, [s * .15, 1.06, -.13], [.012, .05, .01], .003); }
  tube(body, seam, [[0, 1.06, .142], [0, .99, .14], [-.02, .955, .125]], .0028);
  mesh(new THREE.CylinderGeometry(.069, .08, .15, 20), skin, body, [0, 1.86, 0]);
  mesh(new THREE.TorusGeometry(.104, .021, 10, 36), rib, body, [0, 1.8, 0], [1, .74, 1]).rotation.x = Math.PI / 2 - .12;
  mesh(new THREE.CylinderGeometry(.084, .09, .045, 24, 1, true), shirt, body, [0, 1.83, 0]);
  for (const s of [-1, 1]) {
    const point = new THREE.Shape(); point.moveTo(0, 0); point.lineTo(s * .07, -.012); point.lineTo(s * .045, -.062); point.closePath();
    const collar = mesh(new THREE.ExtrudeGeometry(point, { depth: .006, bevelEnabled: true, bevelThickness: .003, bevelSize: .003, bevelSegments: 2 }), shirt, body, [s * .012, 1.838, .078]);
    collar.rotation.x = -.42; collar.rotation.y = s * .32;
  }

  const head = new THREE.Group(); head.name = "Head"; head.position.set(0, 2.04, .014); head.scale.setScalar(.94); body.add(head);
  mesh(sculptedFace(), faceSkin, head, [0, 0, 0]);
  const facePoint = (x: number, y: number, offset = .001): XYZ => [x, y, faceDepth(x, y) + offset];
  // A small, closed smile with lifted corners.
  tube(head, lip, [facePoint(-.036, -.08), facePoint(-.018, -.086), facePoint(0, -.088), facePoint(.018, -.086), facePoint(.036, -.08)], .0012);
  for (const s of [-1, 1]) sphere(head, nostril, [s * .016, -.038, .171], [.0055, .0028, .003]);
  for (const s of [-1, 1]) {
    sphere(head, skin, [s * .152, -.005, -.006], [.024, .042, .021]); sphere(head, lip, [s * .169, -.001, .007], [.003, .022, .009]);
    tube(head, skin, [[s * .161, .026, .009], [s * .172, .012, .011], [s * .165, -.027, .006]], .005);
    const eyeDepth = faceDepth(s * .06, .031);
    sphere(head, white, [s * .06, .031, eyeDepth - .005], [.029, .014, .01]); sphere(head, iris, [s * .06, .031, eyeDepth + .006], [.0105, .011, .002]);
    sphere(head, pupil, [s * .06, .031, eyeDepth + .008], [.0048, .0055, .0015]); sphere(head, white, [s * .056, .036, eyeDepth + .009], [.0018, .0018, .001]);
    tube(head, hairShade, [facePoint(s * .087, .031), facePoint(s * .06, .044), facePoint(s * .032, .032)], .0022);
    tube(head, skin, [facePoint(s * .086, .029), facePoint(s * .06, .019), facePoint(s * .034, .03)], .002);
    mesh(hairLock([facePoint(s * .094, .064), facePoint(s * .064, .073), facePoint(s * .03, .068)], .0055, .003), hair, head, [0, 0, 0]);
    // Thin round frames with a keyhole bridge and temples hooking behind the ears.
    mesh(new THREE.TorusGeometry(.049, .0021, 8, 56), frame, head, [s * .059, .03, .163]);
    tube(head, frame, [[s * .107, .036, .16], [s * .148, .034, .1], [s * .158, .028, .02], [s * .16, .006, -.03]], .0021);
    sphere(head, frame, [s * .107, .034, .16], [.004, .004, .004]);
  }
  tube(head, frame, [[-.011, .034, .168], [-.005, .042, .176], [.005, .042, .176], [.011, .034, .168]], .0021);

  // Curly hair: a sculpted cap plus layered rolled curls, densest on the crown
  // and falling forward over the brow like the reference sheet.
  mesh(sculptedHairBase(), hairShade, head, [0, 0, 0], [1.025, 1.02, 1.03]);
  let seed = 41;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const shell = (a: number, phi: number, k: number) => {
    const front = (Math.cos(a) + 1) / 2;
    return new THREE.Vector3(.161 * k * Math.sin(phi) * Math.sin(a), .206 * k * Math.cos(phi) + .017 * front * Math.sin(phi), .153 * k * Math.sin(phi) * Math.cos(a) - .009);
  };
  const normalAt = (p: THREE.Vector3) => new THREE.Vector3(p.x / .161 ** 2, p.y / .206 ** 2, (p.z + .009) / .153 ** 2).normalize();
  const hairline = (a: number) => Math.acos((-.066 + .186 * ((Math.cos(a) + 1) / 2) ** 2) / .205);
  const curls = 120;
  for (let i = 0; i < curls; i++) {
    const a = i * 2.39996 + random() * .3, phi = Math.acos(1 - (i + .5) / curls * 1.55);
    const limit = hairline(a); if (phi > limit * .985) continue;
    const front = (Math.cos(a) + 1) / 2, crown = 1 - phi / limit;
    const origin = shell(a, phi, 1.0 + .07 * crown + .02 * random());
    const normal = normalAt(origin);
    const wish = new THREE.Vector3(Math.sin(a) * .35 + (random() - .5) * .6, -1 + crown * .4, Math.cos(a) * .3 + front * .9 + (random() - .5) * .5);
    const flow = wish.addScaledVector(normal, -wish.dot(normal)).normalize();
    const length = .07 + random() * .035 + crown * .02, width = .017 + random() * .007;
    mesh(curlLock(origin, flow, normal, length, .02 + random() * .012, .5 + random() * .45, width, i), i % 5 ? hair : hairShade, head, [0, 0, 0]);
  }
  // Fringe curls tumbling over the forehead, and short curled sides.
  for (let i = 0; i < 10; i++) {
    const a = -1.05 + i / 9 * 2.1 + (random() - .5) * .08, phi = hairline(a) * (.84 + random() * .08);
    const origin = shell(a, phi, 1.06), normal = normalAt(origin);
    const wish = new THREE.Vector3(Math.sin(a) * .25 + (random() - .5) * .5, -1, .45);
    const flow = wish.addScaledVector(normal, -wish.dot(normal)).normalize();
    mesh(curlLock(origin, flow, normal, .07 + random() * .03, .022 + random() * .008, .7 + random() * .35, .018 + random() * .005, 200 + i), hair, head, [0, 0, 0]);
  }
  for (let i = 0; i < 18; i++) {
    const a = (i % 2 ? 1 : -1) * (1.2 + Math.floor(i / 2) / 8 * 1.75), phi = hairline(a) * (.8 + random() * .14);
    const origin = shell(a, phi, 1.02), normal = normalAt(origin);
    const wish = new THREE.Vector3(Math.sin(a) * .2, -1, Math.cos(a) * .2 + .2);
    const flow = wish.addScaledVector(normal, -wish.dot(normal)).normalize();
    mesh(curlLock(origin, flow, normal, .045 + random() * .02, .014 + random() * .006, .6 + random() * .3, .015, 300 + i), hair, head, [0, 0, 0]);
  }

  const legs: { hip: THREE.Bone; knee: THREE.Bone; foot: THREE.Group }[] = [];
  const arms: { shoulder: THREE.Bone; elbow: THREE.Bone; side: number }[] = [];
  const skins: { mesh: THREE.SkinnedMesh; bones: THREE.Bone[] }[] = [];
  function limb(parent: THREE.Bone, child: THREE.Bone, g: THREE.BufferGeometry, material: THREE.Material) {
    const m = new THREE.SkinnedMesh(g, material); m.castShadow = m.receiveShadow = true;
    // Only four small deforming meshes; avoid stale rest-pose culling bounds.
    m.frustumCulled = false;
    // The skeleton and mesh share the hip/shoulder's coordinate system.
    parent.add(m); skins.push({ mesh: m, bones: [parent, child] });
  }
  // Outer-leg cargo pocket: bellowed box, buttoned flap and topstitching.
  function cargo(parent: THREE.Object3D, s: number, y: number, height: number, radius: number, z = .012) {
    const x = s * (radius - .004);
    box(parent, trousers, [x, y, z], [.022, height, .118], .01);
    box(parent, trousers, [x + s * .004, y + height / 2 - .012, z], [.026, .04, .124], .01);
    box(parent, seam, [x + s * .006, y + height / 2 - .033, z], [.024, .003, .118], .001);
    sphere(parent, seam, [x + s * .017, y + height / 2 - .016, z], [.003, .007, .007]);
    box(parent, seam, [x + s * .011, y - .012, z + .045], [.003, height * .7, .003], .001);
    box(parent, seam, [x + s * .011, y - .012, z - .045], [.003, height * .7, .003], .001);
  }
  for (const s of [-1, 1]) {
    const suffix = s < 0 ? "L" : "R";
    const hip = new THREE.Bone(); hip.name = `Thigh.${suffix}`; hip.position.set(s * .113, 1.055, 0); body.add(hip);
    cargo(hip, s, -.29, .17, .108);
    const knee = new THREE.Bone(); knee.name = `Shin.${suffix}`; knee.position.y = -.47; hip.add(knee);
    // Relaxed cargo cut: fuller through the thigh, gathered into a rolled hem.
    limb(hip, knee, tailoredLimb(.86, .47, [.1, .113, .108, .097, .092, .093, .088, .082, .08], .92, s), trousers);
    cargo(knee, s, -.12, .12, .089, .02);
    mesh(new THREE.TorusGeometry(.079, .02, 10, 28), trousers, knee, [0, -.355, .004]).rotation.x = Math.PI / 2;
    mesh(new THREE.TorusGeometry(.08, .016, 10, 28), seam, knee, [0, -.333, .004]).rotation.x = Math.PI / 2;
    mesh(new THREE.CylinderGeometry(.052, .056, .06, 18), white, knee, [s * .004, -.39, .01]);
    const foot = new THREE.Group(); foot.name = `Foot.${suffix}`; foot.position.set(s * .012, -.42, .025); knee.add(foot);
    // Retro runner: outsole, chunky midsole, cream mesh upper, grey suede
    // overlays, padded collar, laces and a side "N"-style logo.
    mesh(sneakerPart(-.14, .225, -.15, () => .016, 1.1), outsole, foot, [0, 0, 0]);
    mesh(sneakerPart(-.138, .222, -.137, z => .036 - Math.max(0, z - .12) * .12, 1.08), midsole, foot, [0, 0, 0]);
    mesh(sneakerPart(-.132, .21, -.104, sneakerUpper), canvasUpper, foot, [0, 0, 0]);
    // Grey suede toe cap, heel counter and saddle overlays.
    mesh(sneakerPart(.07, .214, -.106, z => sneakerUpper(z) * .62, 1.05), suede, foot, [0, 0, 0]);
    mesh(sneakerPart(-.136, -.04, -.106, z => sneakerUpper(z) * .78, 1.05), suede, foot, [0, 0, 0]);
    mesh(sneakerPart(-.02, .075, -.106, z => sneakerUpper(z) * .55, 1.04), suede, foot, [0, 0, 0]);
    mesh(new THREE.TorusGeometry(.05, .012, 8, 28), canvasUpper, foot, [0, -.006, -.088], [1.15, 1.25, 1]).rotation.x = Math.PI / 2 - .3;
    box(foot, canvasUpper, [0, .003, .005], [.062, .016, .09], .007).rotation.x = .28;
    for (let i = 0; i < 5; i++) {
      const z = -.025 + i * .025, y = -.104 + sneakerUpper(z) + .004;
      tube(foot, white, [[-.03, y - .006, z], [0, y, z + .005], [.03, y - .006, z]], .0034);
    }
    for (const side of [-1, 1]) {
      const z = .035, halfWidth = .074 * sneakerWidth(z) * 1.04 + .003;
      const decal = mesh(new THREE.PlaneGeometry(.075, .075), logo, foot, [side * halfWidth, -.062, z]);
      decal.rotation.y = side * Math.PI / 2; decal.rotation.x = 0;
    }
    legs.push({ hip, knee, foot });
    const shoulder = new THREE.Bone(); shoulder.name = `UpperArm.${suffix}`; shoulder.position.set(s * .261, 1.698, 0); body.add(shoulder);
    const elbow = new THREE.Bone(); elbow.name = `Forearm.${suffix}`; elbow.position.set(0, -.315, 0); shoulder.add(elbow);
    limb(shoulder, elbow, tailoredLimb(.596, .315, [0, .088, .09, .083, .077, .074, .078, .072, .062], .94, s), knit);
    // Pushed-up sleeve gathers into a chunky ribbed cuff.
    mesh(new THREE.TorusGeometry(.068, .012, 8, 24), knit, elbow, [s * .008, -.225, 0]).rotation.x = Math.PI / 2;
    cuff(elbow, rib, -.262, .061, .062).position.x = s * .01;
    // Relaxed hand: palm towards the thigh, four jointed fingers and a thumb.
    const hand = new THREE.Group(); hand.position.set(s * .01, -.335, .004); hand.rotation.z = -s * .08; elbow.add(hand);
    sphere(hand, skin, [0, -.012, 0], [.025, .046, .042]);
    sphere(hand, skin, [0, .03, 0], [.03, .022, .032]);
    for (let i = 0; i < 4; i++) {
      const z = .028 - i * .018, len = [.046, .052, .049, .04][i];
      const finger = mesh(new THREE.CapsuleGeometry(.0085 - i * .0006, len, 4, 8), skin, hand, [-s * .004, -.07 - len / 2 + .01, z]);
      finger.rotation.x = .06 * (i - 1.5); finger.rotation.z = s * .18;
    }
    const thumb = mesh(new THREE.CapsuleGeometry(.0098, .04, 4, 8), skin, hand, [-s * .012, -.04, .042]);
    thumb.rotation.set(.55, 0, s * .45);
    shoulder.rotation.z = s * .055; arms.push({ shoulder, elbow, side: s });
    // Backpack shoulder straps with adjuster buckles at chest height.
    strap(body, leather, [[s * .16, 1.2, .118], [s * .184, 1.45, .17], [s * .19, 1.64, .145], [s * .186, 1.775, .03], [s * .17, 1.72, -.17]], .028, .007);
    strap(body, darkLeather, [[s * .162, 1.36, .158], [s * .175, 1.5, .178]], .022, .004);
    buckle(body, [s * .183, 1.545, .176], .045, [-.22, 0, 0]);
    box(body, darkLeather, [s * .182, 1.5, .176], [.056, .016, .012], .004).rotation.x = -.2;
    strap(body, leather, [[s * .155, 1.165, .096], [s * .175, 1.19, -.02], [s * .17, 1.2, -.19]], .02, .006);
  }

  // Dark brown leather rucksack: buckled top flap, front pocket with a
  // stitched gold "h", side pockets, studs, top handle and edge piping.
  const pack = new THREE.Group(); pack.position.set(0, 1.437, -.247); body.add(pack);
  box(pack, leather, [0, -.01, -.034], [.39, .5, .2], .055);
  box(pack, darkLeather, [0, .19, -.048], [.4, .14, .205], .05);
  box(pack, leather, [0, .14, -.133], [.37, .23, .05], .03);
  box(pack, leather, [0, -.13, -.145], [.33, .19, .065], .03);
  box(pack, darkLeather, [0, -.06, -.168], [.335, .05, .03], .012);
  box(pack, leather, [0, .12, -.163], [.05, .2, .01], .004);
  buckle(pack, [0, .055, -.172], .052);
  for (const [x, y] of [[-.16, -.21], [.16, -.21], [-.16, .23], [.16, .23], [-.145, .03], [.145, .03]]) sphere(pack, brass, [x, y, -.148], [.008, .008, .005]);
  tube(pack, stitch, [[-.172, -.21], [-.172, .2], [-.12, .246], [.12, .246], [.172, .2], [.172, -.21]].map(([x, y]) => [x, y, -.162] as XYZ), .002);
  tube(pack, stitch, [[-.152, -.04], [-.152, -.214], [.152, -.214], [.152, -.04]].map(([x, y]) => [x, y, -.18] as XYZ), .0018);
  for (const s of [-1, 1]) {
    box(pack, leather, [s * .21, -.05, -.03], [.06, .25, .15], .025);
    box(pack, darkLeather, [s * .222, .065, -.03], [.066, .04, .155], .012);
    box(pack, leather, [s * .245, -.02, -.03], [.008, .16, .022], .003);
    buckle(pack, [s * .25, .02, -.03], .034, [0, s * Math.PI / 2, 0]);
    box(pack, darkLeather, [s * .11, .22, .072], [.04, .12, .02], .006);
  }
  tube(pack, darkLeather, [[-.065, .245, -.02], [-.05, .3, -.03], [0, .315, -.03], [.05, .3, -.03], [.065, .245, -.02]], .011);
  const monogram = canvasTexture(128, 128, ctx => { ctx.fillStyle = "#d4a457"; ctx.font = "84px Georgia"; ctx.textAlign = "center"; ctx.fillText("h", 64, 98); });
  mesh(new THREE.PlaneGeometry(.11, .11), new THREE.MeshStandardMaterial({ map: monogram, transparent: true, roughness: .4, metalness: .7, depthWrite: false }), pack, [0, -.14, -.179]).rotation.y = Math.PI;

  // Merge static details per joint to avoid one draw call for every curl.
  function batch(group: THREE.Object3D) {
    group.children.filter(c => c instanceof THREE.Group || c instanceof THREE.Bone).forEach(batch);
    const groups = new Map<THREE.Material, THREE.Mesh[]>();
    for (const c of group.children) if (c instanceof THREE.Mesh && !(c instanceof THREE.SkinnedMesh) && !Array.isArray(c.material)) { const list = groups.get(c.material) ?? []; list.push(c); groups.set(c.material, list); }
    for (const [material, parts] of groups) {
      if (parts.length < 2) continue;
      const geometries = parts.map(part => {
        part.updateMatrix();
        const g = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
        // Extrusions carry an extra "uv1"-less attribute layout; keep only the shared set.
        for (const name of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(name)) g.deleteAttribute(name);
        if (!g.getAttribute("uv")) g.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(g.getAttribute("position").count * 2), 2));
        return g.applyMatrix4(part.matrix);
      });
      const merged = mergeGeometries(geometries, false);
      if (merged) { parts.forEach(part => { group.remove(part); part.geometry.dispose(); }); mesh(merged, material, group, [0, 0, 0]); }
      geometries.forEach(g => g.dispose());
    }
  }
  batch(body);
  root.updateMatrixWorld(true);
  for (const item of skins) item.mesh.bind(new THREE.Skeleton(item.bones));
  let phase = 0, lastTime = 0, blend = 0, inspection = 0, inspectUntil = 0;
  return {
    root,
    inspect(time: number) {
      inspectUntil = time + 1.4; inspection = 1;
    },
    update(time: number, speed: number, reduced: boolean, nearby = false) {
      const dt = Math.min(.05, Math.max(0, time - lastTime)); lastTime = time;
      const running = THREE.MathUtils.clamp((speed - 2.5) / 2.3, 0, 1);
      blend = THREE.MathUtils.damp(blend, Math.min(1, speed / 2), 12, dt);
      phase += dt * (7.1 + running * 3.4);
      inspection = reduced ? (time < inspectUntil ? 1 : 0) : THREE.MathUtils.damp(inspection, time < inspectUntil ? 1 : 0, 9, dt);
      const amplitude = blend * (reduced ? .22 : .44 + running * .23);
      legs.forEach(({ hip, knee, foot }, i) => {
        const wave = Math.sin(phase + i * Math.PI);
        hip.rotation.x = wave * amplitude - running * blend * .12;
        knee.rotation.x = (Math.max(0, -wave) * (.55 + running * .65) + .06 * running) * blend;
        foot.rotation.x = -hip.rotation.x * .25 - knee.rotation.x * .38 + Math.max(0, wave) * .12 * blend;
      });
      arms.forEach(({ shoulder, elbow, side }, i) => {
        const wave = Math.sin(phase + i * Math.PI), reach = i === 1 ? inspection : 0;
        // Reach out and up toward the exhibit, like the "Interact" pose sheet.
        shoulder.rotation.x = -wave * amplitude * .72 - reach * 1.35;
        shoulder.rotation.z = side * (.055 + running * blend * .08 + reach * .5);
        elbow.rotation.x = -.14 - running * blend * 1.05 - reach * .22;
      });
      const idle = reduced ? 0 : (1 - blend) * (1 - inspection);
      body.position.y = reduced ? 0 : Math.abs(Math.sin(phase)) * blend * (.018 + running * .02) - idle * .004 * (1 + Math.sin(time * 1.6));
      body.rotation.x = reduced ? 0 : running * blend * .075;
      body.rotation.z = reduced ? 0 : Math.sin(phase) * blend * .015 + idle * Math.sin(time * .5) * .012;
      body.rotation.y = reduced ? 0 : Math.sin(phase) * blend * .045;
      pack.rotation.x = reduced ? 0 : Math.sin(phase - .22) * blend * (.022 + running * .03);
      head.rotation.y = reduced ? 0 : speed > .1 ? -body.rotation.y : Math.sin(time * .38) * .06 * (1 - inspection) + inspection * .32;
      head.rotation.x = nearby && speed < .1 ? -.055 - inspection * .06 : running * blend * -.05;
    },
  };
}
