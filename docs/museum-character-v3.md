# Hisyam character v3

## What is delivered

A custom, fully three-dimensional character built locally without a Meshy account, paid 3D API, or new application dependencies. This is a procedural sculpt and an articulated game asset, not an image-to-3D reconstruction, photogrammetry scan, or exact photographic likeness. It remains semi-realistic/stylized; the generated v2 reference renders have higher visual fidelity than this runtime model.

- `lib/museum/avatar-geometry.ts`: continuous sculpted face, mathematically surface-attached details, tapered fluted hair locks and shaped scalp, weighted sleeve/trouser surfaces.
- `lib/museum/avatar.ts`: round glasses, swept black hair, black knit sweater, dark trousers, white sneakers, black backpack with brass hardware and h. Four two-bone skinned surfaces deform the elbows and knees; static detail is batched per joint. Existing speed-driven gameplay and reduced-motion behavior are preserved.
- `lib/museum/avatar-clips.ts`: portable in-place Idle, Walk, Run, Interact clips, including ankle compensation.
- `public/museum/hisyam-character-v3.glb`: downloadable glTF 2.0 asset with four skins and four animation clips; 57,450 triangles, 38 meshes, approximately 4.86 MB. Skin vertices are baked into bind-world space with identity scene-root mesh transforms for glTF portability.
- `public/museum/character-v3-preview.html`: independent orbit/close-up/animation viewer. Its bundled JS and GLB are not loaded by the portfolio homepage. The museum uses the same source geometry, preserving dynamic movement and avoiding an extra GLB download.
- `public/museum/character-knit-v3.png`: generated fine-knit height map; neutral non-color texture used subtly as a bump map. The model's geometry, face and animation are not generated PNGs.

## Rebuild assets

Build tooling lives in an isolated temporary npm runtime containing Three.js 0.186.1, esbuild and @napi-rs/canvas. It is not an application dependency change.

```sh
node scripts/export-museum-avatar.mjs /path/to/build-runtime
```

Bundle `scripts/museum-avatar-preview.ts` with esbuild into `public/museum/character-v3-preview.js`. Resolve its Three.js imports from the build runtime. For an iCloud-backed workspace, copying the entry into the temporary runtime first avoids slow cold reads of workspace dependencies.

## Generated material prompt

Built-in imagegen was used, not the API fallback.

Use case: stylized-concept. Asset type: seamless grayscale fine-knit material height map for a real-time 3D character sweater. Generate one perfectly flat, square, edge-to-edge close-up textile surface, no garment shape. Very fine black sweater knit loops portrayed in neutral middle gray, tiny evenly scaled woven stitch relief, subtle microfibers, physically plausible finely knitted cotton. Uniform orthographic overhead view, absolutely even ambient lighting. Mid-gray base, shallow light-gray yarn ridges, slightly darker recesses. Low contrast, seamless repeating pattern in both axes, aligned vertical knit stitches, no shadows, no perspective, no borders, no words, no labels, no face, no person. Intended solely as a subtle bump map; not a fashion illustration.

## Verification

Khronos glTF validation of the final exported binary completed with zero errors, zero warnings, and no truncation. Informational messages cover unused UV attributes and the validator's lack of support for `EXT_materials_bump`; viewers without that optional extension retain the base materials. The local viewer successfully loaded the file and displayed the face, full body, and Walk/Run/Interact controls. Strict TypeScript checking of the museum modules passed. The remote Next.js build includes lint and full type validation.

No CMS records or database schema were changed. Skeleton resources are disposed when leaving the museum. No new camera gestures, delayed keyboard responses or mandatory decorative animations were added.
