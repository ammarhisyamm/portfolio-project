# Museum character and lighting refinement

## Art direction

Preserve the existing cinematic museum and its CMS-backed content. Design dials: variance 8, motion 7, UI density 2. The warm brass, dark marble and heritage serif are intentional reference-led choices. Remove the left room heading, description and numbered navigation rail; retain the top navigation, movement guide and minimap. The collection remains available through the header icon.

The visitor is a real procedural 3D mesh, not a billboard and not an AI-generated rigged GLB. The generated sheets below are visual references, not runtime character textures. The implementation improves adult proportions, shaped jaw, smaller eyes, round wire glasses, swept curved hair, knit bump detail, finger forms, sneaker soles/laces and matte black backpack with gold hardware and h monogram. It is still a stylized native model, not a scan or an exact likeness of the photograph.

Limb pivots include shoulders, elbows, hips, knees and ankles. Walk/run share a continuous phase, with speed damping, knee flex, opposing arm swing, subtle body lean and backpack follow-through. Inspection poses acknowledge selection without delaying the content dialog. Reduced motion removes idle gestures and body bob, and keeps immediate navigation/camera changes.

The room now has layered arch moldings, column rings, local exhibit spotlights, neutral fill and warm directional light, richer foliage, a stepped apse, statue and h banner. Shader light shafts integrate a feathered cone density through a bounded volume (16 samples desktop, 8 mobile). This is a cinematic approximation, not physically accurate volumetrics. Desktop HDR bloom applies above a 1.25 luminance threshold so normal artwork does not bloom; mobile omits the composer and planar reflection. Toggle transitions are frame-independent and interruptible. Shader materials, composer passes and render targets are disposed on view changes.

## Generated visual references

- `public/museum/character-turnaround-v2.png`: front, three-quarter, side, back.
- `public/museum/character-poses-v2.png`: idle, walk, run, interact.

### Turnaround prompt

Create a polished 3D CHARACTER TURNAROUND SHEET for a third-person museum exploration game. The attached image is an identity, outfit and material reference, NOT a layout to reproduce. Four full-body views of exactly the SAME young adult Southeast Asian man: front, three-quarter front, side, back. All same height, same neutral relaxed A-pose and same adult seven-head-tall proportions, not chibi, not a child, no oversized head or giant eyes. Face based on the male photo and character in the reference, round thin dark wire glasses, wavy swept black hair, natural subtle facial detail. Black fine-knit crewneck sweater over a small white collar, dark tailored cargo trousers, off-white detailed sneakers. Matte black leather backpack with fine stitching, restrained gold buckles and a small gold lowercase 'h' monogram, visible in side/back views. Warm cinematic key light and soft neutral fill show real volume, matte fabric, soft skin and leather detail without crushed blacks or orange skin. Plain dark charcoal studio backdrop, consistent orthographic camera, equal spacing, feet fully visible, no museum background. Small labels only 'Front', '3/4', 'Side', 'Back' below corresponding views. Premium game character model reference render, not a UI collage, no extra people, no close-ups, no extra text.

### Animation pose prompt

Create ONE premium game character animation pose reference sheet, four equally sized full-body poses in one row labeled only 'Idle', 'Walk', 'Run', 'Interact'. Use the attached turnaround as the EXACT identity, adult proportions, outfit, face, black swept hair, round glasses, white collar, matte black knit sweater, dark cargo trousers, off-white sneakers, matte black backpack with gold hardware and lowercase h monogram. Preserve the character's face and seven-head adult proportions exactly, no chibi or cartoon child. Idle: relaxed natural standing. Walk: convincing mid-stride with opposing arms, bent knee and foot planting. Run: controlled jogging pose with forward lean, flexed elbows and lifted trailing foot. Interact: standing and reaching right hand toward an imaginary exhibit at chest height, looking toward the hand, no actual exhibit needed. Entire bodies and shoes fully visible, poses anatomically plausible, consistent warm key light/neutral fill and plain dark charcoal studio backdrop. Same rendering style and scale as the turnaround, subtle fabric/skin/leather detail, no extra props, no extra text, no environment, no UI.

## Verification

Verified on 2026-10-09: strict isolated TypeScript check of the Three.js modules passed; the remote Next.js 15.5.23 build, lint and full type validation passed. Desktop (1280 x 720) and portrait mobile (390 x 844) renders were visually checked. The shader/browser error and warning scan was empty. Guided room travel, light dimming/restoration, collection access, keyboard inspection and the Nomory CMS case-study flow worked. Shift+W changed the player's minimap position; the mobile joystick also changed the player's position. No horizontal overflow or left heading/rail remained on mobile. Switching to classic view left zero museum canvases and removed the museum root attribute. Desktop HDR output uses two-sample multisampling; the floor-contact shade anchors the visitor's feet. The final room includes a curved vault and recessed side-wall bays.

No new database schema, CMS content, route structure or dependencies were introduced. Generated sheets are not downloaded during museum initialization.
