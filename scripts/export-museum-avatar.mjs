// Build-only dependencies live in a temporary npm directory, not the app.
// Usage: node scripts/export-museum-avatar.mjs /path/to/build-runtime
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { writeFile, readFile } from "node:fs/promises";

const runtime = resolve(process.argv[2] ?? ".");
const require = createRequire(resolve(runtime, "package.json"));
const { build } = require("esbuild");
const { createCanvas, loadImage, ImageData } = require("@napi-rs/canvas");
const THREE = await import(pathToFileURL(require.resolve("three").replace(/three\.cjs$/, "three.module.js")));
const { GLTFExporter } = await import(pathToFileURL(require.resolve("three/addons/exporters/GLTFExporter.js")));
globalThis.HTMLCanvasElement = createCanvas(1, 1).constructor;
globalThis.ImageData = ImageData;
globalThis.document = { createElement: () => {
  const canvas = createCanvas(128, 128);
  canvas.toBlob = callback => callback(new Blob([canvas.toBuffer("image/png")], { type: "image/png" }));
  return canvas;
} };
globalThis.FileReader = class {
  async readAsArrayBuffer(blob) { this.result = await blob.arrayBuffer(); this.onloadend?.(); }
  async readAsDataURL(blob) { this.result = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString("base64")}`; this.onloadend?.(); }
};
const modelPath = resolve(runtime, "avatar-build.mjs"), clipsPath = resolve(runtime, "avatar-clips-build.mjs");
for (const [entry, outfile] of [["lib/museum/avatar.ts", modelPath], ["lib/museum/avatar-clips.ts", clipsPath]]) {
  await build({ entryPoints: [resolve(entry)], outfile, bundle: true, packages: "external", platform: "node", format: "esm" });
}
const { createMuseumAvatar } = await import(pathToFileURL(modelPath));
const { createAvatarClips } = await import(pathToFileURL(clipsPath));
const image = await loadImage(await readFile("public/museum/character-knit-v3.png"));
const knitCanvas = document.createElement("canvas"); knitCanvas.width = knitCanvas.height = 1024;
knitCanvas.getContext("2d").drawImage(image, 0, 0, 1024, 1024);
const avatar = createMuseumAvatar(new THREE.CanvasTexture(knitCanvas));
// Contact shade belongs to the environment, not the portable model.
for (const child of [...avatar.root.children]) if (child.isMesh) avatar.root.remove(child);
const clips = createAvatarClips(avatar.root);
avatar.root.userData = { author: "Hisyam Design", version: 3, origin: "Custom procedural 3D sculpt with skin-weighted limbs; not an AI image-to-3D output" };
const portableScene = new THREE.Scene(); portableScene.add(avatar.root);
const skinMeshes = []; avatar.root.traverse(node => { if (node.isSkinnedMesh) skinMeshes.push(node); });
// glTF skins belong at scene root: joint transforms, not the mesh's parents,
// provide their movement. Preserve the bound world matrix while reparenting.
portableScene.updateMatrixWorld(true);
for (const mesh of skinMeshes) {
  portableScene.attach(mesh);
  mesh.geometry.applyMatrix4(mesh.bindMatrix);
  mesh.bindMatrix.identity(); mesh.bindMatrixInverse.identity();
  mesh.position.set(0, 0, 0); mesh.quaternion.identity(); mesh.scale.setScalar(1);
  mesh.updateMatrixWorld(true);
}
const binary = await new GLTFExporter().parseAsync(portableScene, { binary: true, trs: true, animations: clips, maxTextureSize: 1024 });
await writeFile("public/museum/hisyam-character-v3.glb", new Uint8Array(binary));
let triangles = 0, meshes = 0, skins = 0;
portableScene.traverse(n => { if (n.isMesh) { meshes++; triangles += (n.geometry.index?.count ?? n.geometry.attributes.position.count) / 3; if (n.isSkinnedMesh) skins++; } });
console.log(JSON.stringify({ bytes: binary.byteLength, meshes, triangles, skins, clips: clips.map(c => c.name) }));
