import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { canvasTexture, haloTexture } from "./materials";

/** Hisyam as a clean, toy-like figure: a friendly face behind round glasses,
 * a cloud of curls, black knit over a white shirt, dark cargo trousers, cream
 * runners and a brown leather backpack. Simple, readable shapes over detail;
 * every limb hangs off a named bone so the portable clips still apply. */
export function createMuseumAvatar(knitMap?: THREE.Texture) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  root.name = "Hisyam"; body.name = "Body";
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(.9, .66), new THREE.MeshBasicMaterial({ map: haloTexture(), color: "#100c07", transparent: true, opacity: .36, depthWrite: false, toneMapped: false }));
  contact.rotation.x = -Math.PI / 2; contact.position.set(0, .028, .02); root.add(contact);
  if (knitMap) { knitMap.colorSpace = THREE.NoColorSpace; knitMap.wrapS = knitMap.wrapT = THREE.RepeatWrapping; knitMap.repeat.set(3, 3); }
  const knit = new THREE.MeshStandardMaterial({ color: "#232120", roughness: .92, bumpMap: knitMap ?? null, bumpScale: .004 });
  const rib = new THREE.MeshStandardMaterial({ color: "#1a1918", roughness: .95 });
  const trousers = new THREE.MeshStandardMaterial({ color: "#35302b", roughness: .9 });
  const seam = new THREE.MeshStandardMaterial({ color: "#26221e", roughness: .9 });
  const shirt = new THREE.MeshStandardMaterial({ color: "#f1eee7", roughness: .8, side: THREE.DoubleSide });
  const skin = new THREE.MeshStandardMaterial({ color: "#d9a983", roughness: .7 });
  const blush = new THREE.MeshStandardMaterial({ color: "#d98f78", roughness: .75, transparent: true, opacity: .3, depthWrite: false });
  const hair = new THREE.MeshStandardMaterial({ color: "#191513", roughness: .62 });
  const ink = new THREE.MeshStandardMaterial({ color: "#1d1512", roughness: .35 });
  const glint = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const lip = new THREE.MeshStandardMaterial({ color: "#8a4c3e", roughness: .6 });
  const frame = new THREE.MeshStandardMaterial({ color: "#2a2420", metalness: .6, roughness: .3 });
  const leather = new THREE.MeshStandardMaterial({ color: "#5a3722", roughness: .55 });
  const darkLeather = new THREE.MeshStandardMaterial({ color: "#3d2416", roughness: .6 });
  const brass = new THREE.MeshStandardMaterial({ color: "#c99a48", metalness: .85, roughness: .3 });
  const canvasUpper = new THREE.MeshStandardMaterial({ color: "#ebe4d6", roughness: .85 });
  const suede = new THREE.MeshStandardMaterial({ color: "#c3bbad", roughness: .95 });
  const sole = new THREE.MeshStandardMaterial({ color: "#f3efe6", roughness: .85 });
  const outsole = new THREE.MeshStandardMaterial({ color: "#45413c", roughness: .95 });
  const nLogo = canvasTexture(128, 128, ctx => {
    ctx.translate(64, 64); ctx.transform(1, 0, -.28, 1, 0, 0);
    ctx.font = "bold 104px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#3a3f49"; ctx.fillText("N", 0, 4);
  });
  const logo = new THREE.MeshStandardMaterial({ map: nLogo, transparent: true, roughness: .8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  type XYZ = [number, number, number];
  function mesh(g: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, pos: XYZ, scale?: XYZ) {
    const m = new THREE.Mesh(g, material); m.position.set(...pos); if (scale) m.scale.set(...scale);
    m.castShadow = m.receiveShadow = true; parent.add(m); return m;
  }
  const sphere = (p: THREE.Object3D, m: THREE.Material, pos: XYZ, s: XYZ) => mesh(new THREE.SphereGeometry(1, 24, 16), m, p, pos, s);
  const box = (p: THREE.Object3D, m: THREE.Material, pos: XYZ, s: XYZ, radius = .02) => mesh(new RoundedBoxGeometry(...s, 3, radius), m, p, pos);
  const capsule = (p: THREE.Object3D, m: THREE.Material, pos: XYZ, radius: number, length: number) => mesh(new THREE.CapsuleGeometry(radius, length, 6, 18), m, p, pos);
  function tube(p: THREE.Object3D, m: THREE.Material, points: XYZ[], radius: number) {
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(v => new THREE.Vector3(...v))), 24, radius, 8), m, p, [0, 0, 0]);
  }
  const lathe = (p: THREE.Object3D, m: THREE.Material, profile: [number, number][], depth: number) => mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 40), m, p, [0, 0, 0], [1, 1, depth]);

  // Torso: a soft knit sweater with the white shirt peeking out at the hem and collar.
  lathe(body, knit, [[.19, 1.0], [.245, 1.03], [.255, 1.16], [.262, 1.33], [.25, 1.45], [.2, 1.52], [.11, 1.555], [0, 1.56]], .68);
  mesh(new THREE.TorusGeometry(.243, .028, 10, 40), rib, body, [0, 1.03, 0], [1, .68, 1]).rotation.x = Math.PI / 2;
  mesh(new THREE.CylinderGeometry(.238, .232, .05, 40, 1, true), shirt, body, [0, .985, 0], [1, 1, .68]);
  lathe(body, trousers, [[0, .9], [.12, .905], [.2, .95], [.228, 1.0], [.23, 1.02]], .68);
  mesh(new THREE.CylinderGeometry(.062, .07, .12, 20), skin, body, [0, 1.6, 0]);
  mesh(new THREE.TorusGeometry(.086, .02, 10, 32), rib, body, [0, 1.55, 0], [1, .8, 1]).rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) {
    const point = new THREE.Shape(); point.moveTo(0, 0); point.lineTo(s * .075, -.006); point.lineTo(s * .04, -.062); point.closePath();
    const collar = mesh(new THREE.ExtrudeGeometry(point, { depth: .008, bevelEnabled: true, bevelThickness: .003, bevelSize: .003, bevelSegments: 2 }), shirt, body, [s * .008, 1.578, .07]);
    collar.rotation.x = -.42; collar.rotation.y = s * .3;
  }

  // Head: a friendly rounded face, round glasses and a cloud of curls.
  const head = new THREE.Group(); head.name = "Head"; head.position.set(0, 1.83, .01); body.add(head);
  sphere(head, skin, [0, 0, 0], [.235, .26, .235]);
  for (const s of [-1, 1]) {
    sphere(head, skin, [s * .232, -.01, -.01], [.04, .058, .03]);
    sphere(head, ink, [s * .082, .005, .21], [.03, .038, .016]);
    sphere(head, glint, [s * .082 + .01, .02, .224], [.009, .01, .004]).castShadow = false;
    const brow = mesh(new THREE.CapsuleGeometry(.011, .05, 4, 8), hair, head, [s * .085, .078, .214]); brow.rotation.set(0, s * .25, Math.PI / 2 - s * .1);
    sphere(head, blush, [s * .135, -.07, .17], [.04, .022, .02]).castShadow = false;
    // Round wire frames, temples running back to the ears.
    mesh(new THREE.TorusGeometry(.064, .0065, 8, 40), frame, head, [s * .085, .004, .238]);
    tube(head, frame, [[s * .149, .015, .232], [s * .2, .014, .17], [s * .235, .012, .06], [s * .238, -.006, -.02]], .0055);
  }
  tube(head, frame, [[-.022, .012, .244], [0, .022, .25], [.022, .012, .244]], .0055);
  sphere(head, skin, [0, -.045, .235], [.024, .022, .02]);
  tube(head, lip, [[-.045, -.108, .21], [-.022, -.12, .211], [0, -.123, .211], [.022, -.12, .211], [.045, -.108, .21]], .0062);

  // Curls: overlapping round clusters over the crown, sides and back, plus a
  // soft fringe falling over the forehead. Seeded, so every visit matches.
  let seed = 23;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  sphere(head, hair, [0, .1, -.02], [.25, .2, .245]);
  sphere(head, hair, [0, -.03, -.06], [.235, .2, .2]);
  for (let i = 0; i < 96; i++) {
    const a = i * 2.39996, y = 1 - (i + .5) / 96 * 1.6;
    const ring = Math.sqrt(Math.max(0, 1 - y * y)), front = Math.cos(a);
    // Keep the face clear; curls run lower over the ears and the back.
    if (y < (front > .25 ? .42 : front > -.25 ? -.12 : -.55)) continue;
    const r = .26 + random() * .015;
    const radius = .062 + random() * .028;
    sphere(head, hair, [Math.sin(a) * ring * r, .06 + y * .24, front * ring * r * .96 - .015], [radius, radius * .92, radius]);
  }
  for (let i = 0; i < 9; i++) {
    const x = -.17 + i / 8 * .34, radius = .052 + random() * .02;
    sphere(head, hair, [x, .2 - Math.abs(x) * .25 + random() * .02, .17 - Math.abs(x) * .3], [radius, radius * .9, radius * .85]);
  }

  // Limbs hang off bones; rigid parts keep the silhouette simple and clean.
  const legs: { hip: THREE.Bone; knee: THREE.Bone; foot: THREE.Group }[] = [];
  const arms: { shoulder: THREE.Bone; elbow: THREE.Bone; side: number }[] = [];
  for (const s of [-1, 1]) {
    const suffix = s < 0 ? "L" : "R";
    const hip = new THREE.Bone(); hip.name = `Thigh.${suffix}`; hip.position.set(s * .115, .96, 0); body.add(hip);
    capsule(hip, trousers, [0, -.2, 0], .108, .3);
    box(hip, trousers, [s * .105, -.27, .01], [.03, .14, .12], .012);
    box(hip, seam, [s * .113, -.21, .01], [.026, .028, .125], .01);
    const knee = new THREE.Bone(); knee.name = `Shin.${suffix}`; knee.position.y = -.42; hip.add(knee);
    capsule(knee, trousers, [0, -.18, 0], .098, .26);
    mesh(new THREE.TorusGeometry(.094, .022, 10, 28), trousers, knee, [0, -.35, 0]).rotation.x = Math.PI / 2;
    mesh(new THREE.CylinderGeometry(.05, .055, .07, 18), shirt, knee, [0, -.38, .005]);
    const foot = new THREE.Group(); foot.name = `Foot.${suffix}`; foot.position.set(0, -.41, .025); knee.add(foot);
    // Cream runner: dark outsole, chunky midsole, rounded upper, suede accents.
    box(foot, outsole, [0, -.107, .05], [.15, .028, .31], .012);
    box(foot, sole, [0, -.08, .05], [.155, .05, .305], .022);
    sphere(foot, canvasUpper, [0, -.045, .04], [.077, .07, .145]);
    sphere(foot, suede, [0, -.055, .14], [.07, .046, .06]);
    sphere(foot, suede, [0, -.04, -.07], [.068, .06, .045]);
    mesh(new THREE.TorusGeometry(.048, .012, 8, 24), canvasUpper, foot, [0, .012, -.02], [1.1, 1.25, 1]).rotation.x = Math.PI / 2 - .2;
    for (const side of [-1, 1]) { const decal = mesh(new THREE.PlaneGeometry(.06, .06), logo, foot, [side * .079, -.045, .04]); decal.rotation.y = side * Math.PI / 2; }
    legs.push({ hip, knee, foot });

    const shoulder = new THREE.Bone(); shoulder.name = `UpperArm.${suffix}`; shoulder.position.set(s * .275, 1.45, 0); body.add(shoulder);
    sphere(shoulder, knit, [0, -.01, 0], [.085, .08, .08]);
    capsule(shoulder, knit, [0, -.15, 0], .074, .2);
    const elbow = new THREE.Bone(); elbow.name = `Forearm.${suffix}`; elbow.position.set(0, -.3, 0); shoulder.add(elbow);
    capsule(elbow, knit, [0, -.11, 0], .068, .16);
    mesh(new THREE.CylinderGeometry(.062, .062, .05, 20), rib, elbow, [0, -.23, 0]);
    sphere(elbow, skin, [0, -.3, .005], [.05, .065, .045]);
    sphere(elbow, skin, [-s * .03, -.28, .035], [.018, .03, .018]);
    shoulder.rotation.z = s * .06; arms.push({ shoulder, elbow, side: s });
    // Backpack straps over the shoulders, with a small brass adjuster.
    tube(body, leather, [[s * .15, 1.12, .145], [s * .17, 1.32, .175], [s * .18, 1.5, .1], [s * .17, 1.54, -.06], [s * .16, 1.45, -.17]], .02);
    box(body, brass, [s * .165, 1.3, .18], [.042, .03, .012], .006);
  }

  // Brown leather backpack with a buckled flap and a gold "h".
  const pack = new THREE.Group(); pack.position.set(0, 1.27, -.235); body.add(pack);
  box(pack, leather, [0, 0, -.03], [.38, .44, .18], .07);
  box(pack, darkLeather, [0, .15, -.05], [.39, .16, .19], .06);
  box(pack, leather, [0, -.1, -.13], [.28, .17, .06], .03);
  box(pack, brass, [0, .06, -.15], [.045, .035, .012], .006);
  tube(pack, darkLeather, [[-.06, .21, -.03], [-.04, .27, -.035], [0, .285, -.035], [.04, .27, -.035], [.06, .21, -.03]], .012);
  for (const s of [-1, 1]) box(pack, leather, [s * .205, -.06, -.03], [.05, .22, .13], .022);
  const monogram = canvasTexture(128, 128, ctx => { ctx.fillStyle = "#e0b062"; ctx.font = "84px Georgia"; ctx.textAlign = "center"; ctx.fillText("h", 64, 98); });
  mesh(new THREE.PlaneGeometry(.1, .1), new THREE.MeshStandardMaterial({ map: monogram, transparent: true, roughness: .4, metalness: .6, depthWrite: false }), pack, [0, -.1, -.161]).rotation.y = Math.PI;

  // Merge static parts per joint and material, so the figure stays a handful of draw calls.
  function batch(group: THREE.Object3D) {
    group.children.filter(c => c instanceof THREE.Group || c instanceof THREE.Bone).forEach(batch);
    const groups = new Map<THREE.Material, THREE.Mesh[]>();
    for (const c of group.children) if (c instanceof THREE.Mesh && !Array.isArray(c.material)) { const list = groups.get(c.material) ?? []; list.push(c); groups.set(c.material, list); }
    for (const [material, parts] of groups) {
      if (parts.length < 2) continue;
      const geometries = parts.map(part => {
        part.updateMatrix();
        const g = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
        for (const name of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(name)) g.deleteAttribute(name);
        if (!g.getAttribute("uv")) g.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(g.getAttribute("position").count * 2), 2));
        return g.applyMatrix4(part.matrix);
      });
      const merged = mergeGeometries(geometries, false);
      if (merged) {
        const shadow = parts.some(part => part.castShadow);
        parts.forEach(part => { group.remove(part); part.geometry.dispose(); });
        mesh(merged, material, group, [0, 0, 0]).castShadow = shadow;
      }
      geometries.forEach(g => g.dispose());
    }
  }
  batch(body);
  root.updateMatrixWorld(true);
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
        // Reach out and up toward the exhibit.
        shoulder.rotation.x = -wave * amplitude * .72 - reach * 1.35;
        shoulder.rotation.z = side * (.06 + running * blend * .08 + reach * .5);
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
