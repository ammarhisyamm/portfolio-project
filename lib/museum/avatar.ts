import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { canvasTexture, haloTexture } from "./materials";

/** A real articulated mesh. The generated turnaround supplies art direction,
 * not a rigged GLB. Geometry and animation stay local and fully three-dimensional. */
export function createMuseumAvatar() {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(.92, .68), new THREE.MeshBasicMaterial({ map: haloTexture(), color: "#100c07", transparent: true, opacity: .36, depthWrite: false, toneMapped: false }));
  contact.rotation.x = -Math.PI / 2; contact.position.set(0, .028, .02); root.add(contact);
  const textile = canvasTexture(256, 256, ctx => {
    ctx.fillStyle = "#777"; ctx.fillRect(0, 0, 256, 256); ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1.3;
    for (let y = 0; y < 256; y += 8) for (let x = 0; x < 256; x += 6) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3, y + 5); ctx.lineTo(x + 6, y); ctx.stroke(); }
  });
  textile.colorSpace = THREE.NoColorSpace; textile.wrapS = textile.wrapT = THREE.RepeatWrapping; textile.repeat.set(3, 3);
  const knit = new THREE.MeshStandardMaterial({ color: "#17191b", roughness: .92, bumpMap: textile, bumpScale: .008 });
  const rib = new THREE.MeshStandardMaterial({ color: "#111315", roughness: .94, bumpMap: textile, bumpScale: .012 });
  const trousers = new THREE.MeshStandardMaterial({ color: "#242526", roughness: .96, bumpMap: textile, bumpScale: .002 });
  const leather = new THREE.MeshStandardMaterial({ color: "#151619", roughness: .67, metalness: .04 });
  const piping = new THREE.MeshStandardMaterial({ color: "#39342e", roughness: .76 });
  const skin = new THREE.MeshPhysicalMaterial({ color: "#bc8b6d", roughness: .71, sheen: .12, sheenColor: "#e3ae8a" });
  const lip = new THREE.MeshStandardMaterial({ color: "#916553", roughness: .88 });
  const hair = new THREE.MeshStandardMaterial({ color: "#101114", roughness: .72 });
  const hairRidge = new THREE.MeshStandardMaterial({ color: "#222123", roughness: .78 });
  const brass = new THREE.MeshStandardMaterial({ color: "#ab813e", metalness: .86, roughness: .32 });
  const white = new THREE.MeshStandardMaterial({ color: "#e0dfd7", roughness: .83 });
  const sole = new THREE.MeshStandardMaterial({ color: "#c8c9c5", roughness: .96 });
  const frame = new THREE.MeshStandardMaterial({ color: "#302a24", metalness: .72, roughness: .26 });
  const iris = new THREE.MeshStandardMaterial({ color: "#30221b", roughness: .42 });
  const pupil = new THREE.MeshStandardMaterial({ color: "#090b0d", roughness: .28 });
  type XYZ = [number, number, number];
  function mesh(g: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Group, pos: XYZ, scale?: XYZ) {
    const m = new THREE.Mesh(g, material); m.position.set(...pos); if (scale) m.scale.set(...scale);
    m.castShadow = m.receiveShadow = true; parent.add(m); return m;
  }
  const sphere = (p: THREE.Group, m: THREE.Material, pos: XYZ, s: XYZ) => mesh(new THREE.SphereGeometry(1, 24, 18), m, p, pos, s);
  const box = (p: THREE.Group, m: THREE.Material, pos: XYZ, s: XYZ, radius = .015) => mesh(new RoundedBoxGeometry(...s, 3, radius), m, p, pos);
  function tube(p: THREE.Group, m: THREE.Material, points: XYZ[], radius: number) {
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(v => new THREE.Vector3(...v))), 16, radius, 5, false), m, p, [0, 0, 0]);
  }
  const cuff = (p: THREE.Group, m: THREE.Material, y: number, r: number, h: number) => mesh(new THREE.CylinderGeometry(r, r, h, 24), m, p, [0, y, 0]);
  const profile = [[.215, 1.12], [.238, 1.17], [.228, 1.29], [.25, 1.5], [.278, 1.66], [.26, 1.73], [.105, 1.82]];
  mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 32), knit, body, [0, 0, 0], [1, 1, .67]);
  cuff(body, rib, 1.145, .22, .075).scale.z = .68;
  cuff(body, white, 1.105, .207, .029).scale.z = .67;
  box(body, trousers, [0, 1.03, 0], [.415, .22, .25], .075);
  mesh(new THREE.CylinderGeometry(.069, .082, .15, 20), skin, body, [0, 1.86, 0]);
  mesh(new THREE.TorusGeometry(.098, .018, 8, 28), white, body, [0, 1.82, 0]).rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) box(body, white, [s * .059, 1.799, .09], [.063, .057, .021], .008).rotation.z = s * -.36;

  // Defined jaw and smaller eyes give an adult silhouette instead of a chibi head.
  const head = new THREE.Group(); head.position.set(0, 2.074, .012); body.add(head);
  const faceGeometry = new THREE.SphereGeometry(1, 40, 32), points = faceGeometry.getAttribute("position");
  for (let i = 0; i < points.count; i++) {
    const x = points.getX(i), y = points.getY(i), z = points.getZ(i);
    const jaw = y < -.15 ? 1 - Math.pow((-y - .15) / .85, 1.3) * .35 : 1;
    points.setXYZ(i, x * .153 * jaw, y * .191, z * .137 * (z < 0 ? .95 : 1) + (z > .3 && y > -.5 && y < .12 ? .008 : 0));
  }
  faceGeometry.computeVertexNormals(); mesh(faceGeometry, skin, head, [0, 0, 0]);
  sphere(head, skin, [0, -.146, .073], [.063, .03, .037]);
  sphere(head, skin, [0, -.003, .14], [.017, .042, .026]); sphere(head, skin, [0, -.029, .16], [.024, .014, .023]);
  sphere(head, lip, [0, -.085, .137], [.036, .0035, .004]); sphere(head, skin, [0, -.095, .132], [.033, .005, .006]);
  for (const s of [-1, 1]) {
    sphere(head, skin, [s * .098, -.054, .102], [.049, .033, .031]);
    sphere(head, skin, [s * .156, -.005, -.004], [.024, .043, .024]); sphere(head, lip, [s * .173, -.003, .006], [.004, .024, .011]);
    sphere(head, white, [s * .064, .024, .129], [.026, .018, .008]); sphere(head, iris, [s * .064, .024, .137], [.011, .012, .003]);
    sphere(head, pupil, [s * .064, .024, .14], [.005, .007, .002]); sphere(head, white, [s * .061, .029, .142], [.002, .002, .001]);
    tube(head, skin, [[s * .088, .025, .133], [s * .064, .044, .132], [s * .039, .025, .137]], .005);
    tube(head, hair, [[s * .09, .067, .121], [s * .066, .075, .133], [s * .035, .068, .14]], .006);
    mesh(new THREE.TorusGeometry(.052, .0037, 8, 40), frame, head, [s * .062, .024, .157]).scale.y = .97;
    tube(head, frame, [[s * .112, .025, .155], [s * .15, .026, .066], [s * .157, .016, -.008]], .0035);
  }
  tube(head, frame, [[-.012, .028, .16], [0, .035, .171], [.012, .028, .16]], .003);
  sphere(head, hair, [0, .108, -.02], [.161, .114, .135]).rotation.z = -.08;
  for (let i = 0; i < 14; i++) {
    const t = i / 13, x = -.14 + t * .28;
    tube(head, hair, [[x, .12, .065], [x - .022, .195 + Math.sin(t * Math.PI) * .013, .063], [x + .035, .206, -.037], [x + .026, .144, -.117]], .018 + Math.sin(t * Math.PI) * .005);
    tube(head, hairRidge, [[x, .138, .082], [x - .021, .211 + Math.sin(t * Math.PI) * .011, .063], [x + .036, .218, -.026]], .002);
  }
  for (let i = 0; i < 5; i++) tube(head, hair, [[-.13 + i * .034, .14, .071], [-.089 + i * .025, .18, .147], [.018 + i * .019, .108 + i * .01, .112]], .019 - i * .001);
  for (let i = 0; i < 4; i++) {
    const x = -.125 + i * .026;
    tube(head, hair, [[x, .12, .12], [x - .009, .21 + i * .01, .125], [x + .083, .239 + i * .002, .038], [x + .136, .18, -.054]], .018);
    tube(head, hairRidge, [[x, .143, .135], [x - .007, .228 + i * .008, .116], [x + .081, .254 + i * .001, .032]], .002);
  }
  for (const s of [-1, 1]) sphere(head, hair, [s * .141, .07, -.04], [.026, .067, .09]);
  sphere(head, hair, [0, .05, -.072], [.152, .146, .086]);
  for (let i = 0; i < 13; i++) {
    const x = -.135 + i * .0225;
    tube(head, hair, [[x, .185, -.086], [x + .018, .13, -.153], [x - .014, .028, -.145], [x * .76, -.073, -.096]], .009);
    tube(head, hairRidge, [[x, .175, -.096], [x + .019, .127, -.159], [x - .013, .024, -.153]], .0018);
  }

  const legs: { hip: THREE.Group; knee: THREE.Group; foot: THREE.Group }[] = [];
  const arms: { shoulder: THREE.Group; elbow: THREE.Group }[] = [];
  for (const s of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(s * .113, 1.055, 0); body.add(hip);
    mesh(new THREE.LatheGeometry([[.098, 0], [.111, -.06], [.103, -.24], [.093, -.36], [.085, -.47]].reverse().map(([r, y]) => new THREE.Vector2(r, y)), 24), trousers, hip, [0, 0, 0], [1, 1, .93]);
    box(hip, trousers, [s * .085, -.25, .012], [.055, .17, .135], .016); box(hip, piping, [s * .104, -.21, .012], [.009, .022, .122], .003);
    const knee = new THREE.Group(); knee.position.y = -.47; hip.add(knee);
    sphere(knee, trousers, [0, -.018, 0], [.085, .059, .079]);
    mesh(new THREE.LatheGeometry([[.085, 0], [.09, -.085], [.083, -.23], [.074, -.345], [.078, -.414]].reverse().map(([r, y]) => new THREE.Vector2(r, y)), 24), trousers, knee, [0, 0, 0], [1, 1, .92]); cuff(knee, rib, -.392, .08, .045);
    const foot = new THREE.Group(); foot.position.set(0, -.42, .025); knee.add(foot);
    box(foot, sole, [0, -.117, .043], [.19, .057, .327], .028); box(foot, white, [0, -.066, .05], [.171, .1, .295], .039);
    sphere(foot, white, [0, -.058, .134], [.084, .057, .091]); box(foot, sole, [s * .081, -.062, .013], [.009, .025, .105], .003);
    box(foot, white, [0, -.005, .022], [.082, .026, .095], .009);
    for (let i = 0; i < 5; i++) box(foot, sole, [0, .004 - i * .005, .015 + i * .022], [.073, .006, .008], .002).rotation.z = i % 2 ? .1 : -.1;
    legs.push({ hip, knee, foot });
    const shoulder = new THREE.Group(); shoulder.position.set(s * .27, 1.698, 0); body.add(shoulder);
    sphere(shoulder, knit, [s * .012, -.015, 0], [.09, .09, .085]);
    mesh(new THREE.LatheGeometry([[.085, 0], [.088, -.065], [.078, -.19], [.068, -.315]].reverse().map(([r, y]) => new THREE.Vector2(r, y)), 24), knit, shoulder, [s * .019, 0, 0]);
    const elbow = new THREE.Group(); elbow.position.set(s * .025, -.315, 0); shoulder.add(elbow);
    sphere(elbow, knit, [0, 0, 0], [.069, .059, .066]);
    mesh(new THREE.LatheGeometry([[.068, 0], [.073, -.05], [.068, -.16], [.061, -.278]].reverse().map(([r, y]) => new THREE.Vector2(r, y)), 24), knit, elbow, [0, 0, .007]); cuff(elbow, rib, -.267, .068, .058);
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
  function batch(group: THREE.Group) {
    group.children.filter((c): c is THREE.Group => c instanceof THREE.Group).forEach(batch);
    const groups = new Map<THREE.Material, THREE.Mesh[]>();
    for (const c of group.children) if (c instanceof THREE.Mesh && !Array.isArray(c.material)) { const list = groups.get(c.material) ?? []; list.push(c); groups.set(c.material, list); }
    for (const [material, parts] of groups) {
      if (parts.length < 2) continue;
      const geometries = parts.map(part => { part.updateMatrix(); const g = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone(); return g.applyMatrix4(part.matrix); });
      const merged = mergeGeometries(geometries, false);
      if (merged) { parts.forEach(part => { group.remove(part); part.geometry.dispose(); }); mesh(merged, material, group, [0, 0, 0]); }
      geometries.forEach(g => g.dispose());
    }
  }
  batch(body);
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
