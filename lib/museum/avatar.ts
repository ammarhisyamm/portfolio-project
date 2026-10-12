import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { canvasTexture, haloTexture } from "./materials";
import { faceDepth, hairLock, sculptedFace, sculptedHairBase, tailoredLimb } from "./avatar-geometry";

/** A real articulated mesh. The generated turnaround supplies art direction,
 * not a rigged GLB. Geometry and animation stay local and fully three-dimensional. */
export function createMuseumAvatar(knitMap?: THREE.Texture) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  root.name = "Hisyam"; body.name = "Body";
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(.92, .68), new THREE.MeshBasicMaterial({ map: haloTexture(), color: "#100c07", transparent: true, opacity: .36, depthWrite: false, toneMapped: false }));
  contact.rotation.x = -Math.PI / 2; contact.position.set(0, .028, .02); root.add(contact);
  const textile = knitMap ?? canvasTexture(256, 256, ctx => {
    ctx.fillStyle = "#777"; ctx.fillRect(0, 0, 256, 256); ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1.3;
    for (let y = 0; y < 256; y += 8) for (let x = 0; x < 256; x += 6) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3, y + 5); ctx.lineTo(x + 6, y); ctx.stroke(); }
  });
  textile.colorSpace = THREE.NoColorSpace; textile.wrapS = textile.wrapT = THREE.RepeatWrapping; textile.repeat.set(3, 3);
  const knit = new THREE.MeshPhysicalMaterial({ color: "#181a1d", roughness: .96, bumpMap: textile, bumpScale: .0018, sheen: .25, sheenColor: "#55575b", sheenRoughness: .9 });
  const rib = new THREE.MeshStandardMaterial({ color: "#111315", roughness: .94, bumpMap: textile, bumpScale: .012 });
  const trousers = new THREE.MeshStandardMaterial({ color: "#242526", roughness: .96, bumpMap: textile, bumpScale: .002 });
  const leather = new THREE.MeshStandardMaterial({ color: "#151619", roughness: .67, metalness: .04 });
  const piping = new THREE.MeshStandardMaterial({ color: "#39342e", roughness: .76 });
  const pores = canvasTexture(128, 128, ctx => {
    ctx.fillStyle = "#888"; ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 1800; i++) { ctx.fillStyle = i % 2 ? "#999" : "#777"; ctx.fillRect((i * 73) % 128, (i * 37 + Math.floor(i / 128) * 11) % 128, 1, 1); }
  });
  pores.colorSpace = THREE.NoColorSpace;
  const skin = new THREE.MeshPhysicalMaterial({ color: "#bb9279", roughness: .68, bumpMap: pores, bumpScale: .00035, sheen: .06, sheenColor: "#ceb5a5" });
  const faceSkin = skin.clone(); faceSkin.color.set("#ffffff"); faceSkin.vertexColors = true;
  const lip = new THREE.MeshStandardMaterial({ color: "#966d63", roughness: .74 });
  const hair = new THREE.MeshPhysicalMaterial({ color: "#131213", roughness: .48, sheen: .3, sheenColor: "#36302b", sheenRoughness: .65 });
  const hairRidge = new THREE.MeshStandardMaterial({ color: "#211d1b", roughness: .58 });
  const brass = new THREE.MeshStandardMaterial({ color: "#ab813e", metalness: .86, roughness: .32 });
  const white = new THREE.MeshStandardMaterial({ color: "#e0dfd7", roughness: .83 });
  const sole = new THREE.MeshStandardMaterial({ color: "#c8c9c5", roughness: .96 });
  const frame = new THREE.MeshStandardMaterial({ color: "#302a24", metalness: .72, roughness: .26 });
  const iris = new THREE.MeshStandardMaterial({ color: "#30221b", roughness: .42 });
  const pupil = new THREE.MeshStandardMaterial({ color: "#090b0d", roughness: .28 });
  type XYZ = [number, number, number];
  function mesh(g: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, pos: XYZ, scale?: XYZ) {
    const m = new THREE.Mesh(g, material); m.position.set(...pos); if (scale) m.scale.set(...scale);
    m.castShadow = m.receiveShadow = true; parent.add(m); return m;
  }
  const sphere = (p: THREE.Object3D, m: THREE.Material, pos: XYZ, s: XYZ) => mesh(new THREE.SphereGeometry(1, 18, 12), m, p, pos, s);
  const box = (p: THREE.Object3D, m: THREE.Material, pos: XYZ, s: XYZ, radius = .015) => mesh(new RoundedBoxGeometry(...s, 2, radius), m, p, pos);
  function tube(p: THREE.Object3D, m: THREE.Material, points: XYZ[], radius: number) {
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(v => new THREE.Vector3(...v))), 16, radius, 5, false), m, p, [0, 0, 0]);
  }
  const cuff = (p: THREE.Object3D, m: THREE.Material, y: number, r: number, h: number) => mesh(new THREE.CylinderGeometry(r, r, h, 24), m, p, [0, y, 0]);
  const profile = [[.215, 1.12], [.238, 1.17], [.228, 1.29], [.25, 1.5], [.278, 1.66], [.26, 1.73], [.105, 1.82]];
  mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 32), knit, body, [0, 0, 0], [1, 1, .67]);
  cuff(body, rib, 1.145, .22, .075).scale.z = .68;
  cuff(body, white, 1.105, .207, .029).scale.z = .67;
  box(body, trousers, [0, 1.03, 0], [.415, .22, .25], .075);
  mesh(new THREE.CylinderGeometry(.069, .082, .15, 20), skin, body, [0, 1.86, 0]);
  mesh(new THREE.TorusGeometry(.098, .018, 8, 28), white, body, [0, 1.82, 0]).rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) box(body, white, [s * .059, 1.799, .09], [.063, .057, .021], .008).rotation.z = s * -.36;

  const head = new THREE.Group(); head.name = "Head"; head.position.set(0, 2.054, .012); head.scale.setScalar(.94); body.add(head);
  mesh(sculptedFace(), faceSkin, head, [0, 0, 0]);
  const facePoint = (x: number, y: number, offset = .001): XYZ => [x, y, faceDepth(x, y) + offset];
  tube(head, lip, [facePoint(-.034, -.084), facePoint(-.017, -.085), facePoint(0, -.087), facePoint(.017, -.085), facePoint(.034, -.084)], .0009);
  for (const s of [-1, 1]) sphere(head, lip, [s * .017, -.038, .173], [.006, .003, .003]);
  for (const s of [-1, 1]) {
    sphere(head, skin, [s * .152, -.005, -.006], [.022, .04, .02]); sphere(head, lip, [s * .168, -.001, .007], [.003, .021, .009]);
    tube(head, skin, [[s * .16, .024, .009], [s * .17, .012, .011], [s * .164, -.025, .006]], .005);
    const eyeDepth = faceDepth(s * .06, .031);
    sphere(head, white, [s * .06, .031, eyeDepth - .005], [.027, .011, .01]); sphere(head, iris, [s * .06, .031, eyeDepth + .006], [.008, .009, .002]);
    sphere(head, pupil, [s * .06, .031, eyeDepth + .008], [.0035, .0045, .0015]); sphere(head, white, [s * .058, .034, eyeDepth + .009], [.0012, .0012, .001]);
    tube(head, skin, [facePoint(s * .086, .031), facePoint(s * .06, .042), facePoint(s * .033, .031)], .0028);
    tube(head, skin, [facePoint(s * .086, .029), facePoint(s * .06, .019), facePoint(s * .034, .03)], .002);
    mesh(hairLock([facePoint(s * .091, .065), facePoint(s * .062, .072), facePoint(s * .03, .067)], .004, .0025), hair, head, [0, 0, 0]);
    mesh(new THREE.TorusGeometry(.047, .0023, 8, 48), frame, head, [s * .058, .03, .162]).scale.y = .96;
    tube(head, frame, [[s * .104, .032, .162], [s * .15, .03, .066], [s * .157, .015, -.008]], .0024);
  }
  tube(head, frame, [[-.011, .032, .166], [0, .039, .176], [.011, .032, .166]], .0023);
  mesh(sculptedHairBase(), hair, head, [0, 0, 0]);
  // Short tapered sides and nape; layered asymmetric quiff with no spherical cap.
  for (let i = 0; i < 25; i++) {
    const a = .48 + i / 24 * (Math.PI * 2 - .96), front = (Math.cos(a) + 1) / 2;
    const line = -.066 + .186 * front ** 2, cut = Math.acos(line / .205);
    const path = [.35, .72, cut * .86, cut].map(phi => [Math.sin(a) * .161 * Math.sin(phi), .205 * Math.cos(phi) + .013 * front * Math.sin(phi), Math.cos(a) * .154 * Math.sin(phi) - .009]);
    mesh(hairLock(path, .015, .006, i), hair, head, [0, 0, 0]);
  }
  for (let i = 0; i < 17; i++) {
    const x = -.139 + i * .016, lift = Math.sin(i / 16 * Math.PI) * .025;
    const sweep = .025 * (1 - Math.abs(x) / .16);
    const path = [[x, .123, .112], [x - .008, .197 + lift, .09], [x + sweep, .21 + lift, -.024], [x + .014, .153, -.115]];
    mesh(hairLock(path, .024, .017, i), i % 4 ? hair : hairRidge, head, [0, 0, 0]);
  }
  for (let i = 0; i < 7; i++) {
    const x = -.115 + i * .025;
    mesh(hairLock([[x, .155, .097], [x + .028, .188 + i * .003, .11], [x + .054, .126 + i * .005, .121]], .017, .009, i), hair, head, [0, 0, 0]);
  }

  const legs: { hip: THREE.Bone; knee: THREE.Bone; foot: THREE.Group }[] = [];
  const arms: { shoulder: THREE.Bone; elbow: THREE.Bone }[] = [];
  const skins: { mesh: THREE.SkinnedMesh; bones: THREE.Bone[] }[] = [];
  function limb(parent: THREE.Bone, child: THREE.Bone, g: THREE.BufferGeometry, material: THREE.Material) {
    const m = new THREE.SkinnedMesh(g, material); m.castShadow = m.receiveShadow = true;
    // Only four small deforming meshes; avoid stale rest-pose culling bounds.
    m.frustumCulled = false;
    // The skeleton and mesh share the hip/shoulder's coordinate system.
    parent.add(m); skins.push({ mesh: m, bones: [parent, child] });
  }
  for (const s of [-1, 1]) {
    const suffix = s < 0 ? "L" : "R";
    const hip = new THREE.Bone(); hip.name = `Thigh.${suffix}`; hip.position.set(s * .113, 1.055, 0); body.add(hip);
    box(hip, trousers, [s * .085, -.25, .012], [.055, .17, .135], .016); box(hip, piping, [s * .104, -.21, .012], [.009, .022, .122], .003);
    const knee = new THREE.Bone(); knee.name = `Shin.${suffix}`; knee.position.y = -.47; hip.add(knee);
    limb(hip, knee, tailoredLimb(.86, .47, [.092, .108, .101, .089, .084, .087, .08, .072, .076], .91, s), trousers);
    cuff(knee, rib, -.392, .078, .045);
    const foot = new THREE.Group(); foot.name = `Foot.${suffix}`; foot.position.set(s * .012, -.42, .025); knee.add(foot);
    box(foot, sole, [0, -.117, .043], [.19, .057, .327], .028); box(foot, white, [0, -.066, .05], [.171, .1, .295], .039);
    sphere(foot, white, [0, -.058, .134], [.084, .057, .091]); box(foot, sole, [s * .081, -.062, .013], [.009, .025, .105], .003);
    box(foot, white, [0, -.005, .022], [.082, .026, .095], .009);
    for (let i = 0; i < 5; i++) box(foot, sole, [0, .004 - i * .005, .015 + i * .022], [.073, .006, .008], .002).rotation.z = i % 2 ? .1 : -.1;
    legs.push({ hip, knee, foot });
    const shoulder = new THREE.Bone(); shoulder.name = `UpperArm.${suffix}`; shoulder.position.set(s * .261, 1.698, 0); body.add(shoulder);
    const elbow = new THREE.Bone(); elbow.name = `Forearm.${suffix}`; elbow.position.set(0, -.315, 0); shoulder.add(elbow);
    limb(shoulder, elbow, tailoredLimb(.596, .315, [0, .082, .085, .078, .071, .067, .071, .067, .057], .94, s), knit);
    cuff(elbow, rib, -.267, .062, .058);
    sphere(elbow, skin, [0, -.335, .006], [.044, .075, .031]); sphere(elbow, skin, [-s * .036, -.315, .028], [.016, .037, .019]);
    for (let i = 0; i < 4; i++) sphere(elbow, skin, [-.025 + i * .017, -.39, .01], [.009, .024, .01]);
    shoulder.rotation.z = s * .055; arms.push({ shoulder, elbow });
    tube(body, leather, [[s * .165, 1.16, .11], [s * .19, 1.58, .159], [s * .194, 1.752, .038], [s * .173, 1.67, -.18]], .025);
    box(body, brass, [s * .186, 1.48, .176], [.048, .055, .009], .006);
  }
  const pack = new THREE.Group(); pack.position.set(0, 1.437, -.247); body.add(pack);
  box(pack, leather, [0, 0, -.034], [.388, .51, .195], .047); box(pack, leather, [0, .139, -.131], [.357, .197, .065], .023);
  box(pack, leather, [0, -.13, -.135], [.321, .179, .052], .025);
  tube(pack, piping, [[-.165, -.2, -.153], [-.178, -.13, -.153], [-.178, .12, -.153], [-.12, .238, -.14], [.12, .238, -.14], [.178, .12, -.153], [.178, -.13, -.153], [.165, -.2, -.153]], .003);
  for (const s of [-1, 1]) {
    box(pack, leather, [s * .106, .073, -.17], [.029, .16, .014], .005);
    mesh(new THREE.TorusGeometry(.019, .004, 6, 16), brass, pack, [s * .106, .08, -.185]).scale.y = 1.3;
    sphere(pack, brass, [s * .146, .138, -.169], [.006, .006, .003]); box(pack, leather, [s * .202, -.04, -.023], [.045, .172, .131], .015);
    box(pack, brass, [s * .212, .12, -.1], [.011, .027, .01], .003);
  }
  mesh(new THREE.TorusGeometry(.06, .013, 8, 24, Math.PI), leather, pack, [0, .262, .009]).scale.y = .6;
  const monogram = canvasTexture(128, 128, ctx => { ctx.fillStyle = "#b38b4d"; ctx.font = "76px Georgia"; ctx.textAlign = "center"; ctx.fillText("h", 64, 94); });
  mesh(new THREE.PlaneGeometry(.13, .13), new THREE.MeshStandardMaterial({ map: monogram, transparent: true, roughness: .52, metalness: .55 }), pack, [0, -.13, -.165]).rotation.y = Math.PI;

  // Merge static details per joint to avoid one draw call for every hair strand.
  function batch(group: THREE.Object3D) {
    group.children.filter(c => c instanceof THREE.Group || c instanceof THREE.Bone).forEach(batch);
    const groups = new Map<THREE.Material, THREE.Mesh[]>();
    for (const c of group.children) if (c instanceof THREE.Mesh && !(c instanceof THREE.SkinnedMesh) && !Array.isArray(c.material)) { const list = groups.get(c.material) ?? []; list.push(c); groups.set(c.material, list); }
    for (const [material, parts] of groups) {
      if (parts.length < 2) continue;
      const geometries = parts.map(part => { part.updateMatrix(); const g = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone(); return g.applyMatrix4(part.matrix); });
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
      inspectUntil = time + 1.25; inspection = 1;
      arms[1].shoulder.rotation.x = -.82; arms[1].elbow.rotation.x = -.78;
    },
    update(time: number, speed: number, reduced: boolean, nearby = false) {
      const dt = Math.min(.05, Math.max(0, time - lastTime)); lastTime = time;
      const running = THREE.MathUtils.clamp((speed - 2.5) / 2.3, 0, 1);
      blend = THREE.MathUtils.damp(blend, Math.min(1, speed / 2), 12, dt);
      phase += dt * (7.1 + running * 3.4);
      inspection = THREE.MathUtils.damp(inspection, time < inspectUntil ? 1 : 0, 9, dt);
      const amplitude = blend * (reduced ? .22 : .44 + running * .21);
      legs.forEach(({ hip, knee, foot }, i) => { const wave = Math.sin(phase + i * Math.PI); hip.rotation.x = wave * amplitude; knee.rotation.x = Math.max(0, -wave) * blend * (.5 + running * .55); foot.rotation.x = -hip.rotation.x * .25 - knee.rotation.x * .38; });
      arms.forEach(({ shoulder, elbow }, i) => { const wave = Math.sin(phase + i * Math.PI); shoulder.rotation.x = -wave * amplitude * .7 - (i === 1 ? inspection * .82 : 0); elbow.rotation.x = -.13 - running * blend * .8 - (i === 1 ? inspection * .65 : 0); });
      body.position.y = reduced ? 0 : Math.abs(Math.sin(phase)) * blend * (.018 + running * .018);
      body.rotation.x = reduced ? 0 : running * blend * .065; body.rotation.z = reduced ? 0 : Math.sin(phase) * blend * .015;
      pack.rotation.x = reduced ? 0 : Math.sin(phase - .22) * blend * .022;
      head.rotation.y = reduced || speed > .1 ? 0 : Math.sin(time * .38) * .055;
      head.rotation.x = nearby && speed < .1 ? -.055 : 0;
    },
  };
}
