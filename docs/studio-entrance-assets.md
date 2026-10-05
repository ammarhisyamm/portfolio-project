# Studio entrance — assets and motion

Generated with the built-in image generation tool, one asset per call. WebP derivatives retain transparency on the door and ribbon. Original generated PNGs are retained in the Codex generated-images directory.

## Files
- `public/images/studio-door-v3.webp`: single independent door leaf, 500 × 1000, alpha.
- `public/images/studio-ribbon-v3.webp`: intact crimson silk ribbon + h seal, 1400 × 467, alpha. Two CSS clipping regions separate at 62% of the width; the seal remains on the left piece.
- `public/images/studio-room-v3.webp`: studio room, 1920 × 1081.

## Exact generation prompts
### Door
Use case: stylized-concept. Create ONE production web animation asset: a single closed museum door leaf, not a pair, using attached reference only for dark walnut/leather and antique brass inset trim material. Straight-on orthographic view, tall rectangular 1:2 shape, all four edges visible, centered with tiny transparent margins. Finely textured dark brown inset leather panel, substantial bevelled walnut border, elegant thin aged gold rectangular moulding. Warm restrained realistic lighting. NO ribbon, NO wax seal, NO handles, NO hinges outside silhouette, NO text, NO room, NO floor, NO cast shadow outside object. Genuine transparent background. The one door panel should fill nearly the entire portrait canvas so it can be duplicated as two independently swinging door leaves.

### Ribbon
Use case: stylized-concept. Asset: ONE isolated ceremonial ribbon for a web animation, matching the red ribbon and seal in the supplied reference. Render a straight taut horizontal deep crimson silk ribbon, with a round glossy red wax seal embossed with a lowercase serif 'h' EXACTLY at the center. Photorealistic woven silk, soft gathered folds near seal, warm subtle highlights and natural edge shadows. Composition: very wide landscape 4:1, ribbon from left to right fills 96% canvas width, slim ribbon band occupies about 25% canvas height, seal about 65% canvas height. Ends are squared. Completely transparent above, below, behind; NO door, NO room, NO surrounding objects, NO scissors, NO other text, NO particles. Continuous intact ribbon, suitable for splitting via CSS into two independently animated halves.

### Room
Use case: stylized-concept. Asset: ONE photorealistic empty studio museum interior background for a full-screen website opening scene. Attached storyboard is style and material reference only; do NOT reproduce a storyboard. Create ONE wide 16:9 room, camera straight ahead at eye level. Dark charcoal warm walnut wall, warm amber cone spotlight high at exact center, subtle bronze detailing. Clean expansive empty central wall and negative space, smooth dark stone floor with soft reflections in lower fifth. At far left a small black-and-brass desk lamp on a low stack of books/plinth; at far right a restrained olive branch in a tall dark vase; subtle vertical wall grooves and side stone columns. Museum hush, high-end editorial realism, rich dark shadows but clear material detail. The central 65% must be empty: no doors, no ribbons, no seals, no artworks, no furniture in middle, no products, no typography, no UI, no captions, no diagrams. This will sit BEHIND independently animated doors rendered in CSS. Cohesive warm brown, black, bronze palette. No foreground steps or pedestal blocking the entrance.

## Motion intent
Rare first-session introduction: delight, explanation, spatial consistency. CSS transforms and opacity; custom ease-out, drawer, and on-screen travel curves from the animate skill. No added animation dependencies. The ceremony opens the doorway, then waits for the visitor to step inside.

- Hover over ribbon: scissors follow the pointer locally; touch uses the same ribbon target with a tap instruction.
- 0–1100ms: two blade movements, ending in a fully closed snip.
- 1100ms: ribbon parts separate, small thread particles disperse.
- 1850ms: independently hinged door leaves open over 1300ms.
- 3150ms: doorway is fully open. Scroll down, swipe up, or activate the doorway to enter.
- On entry: camera pushes through the doorway over 1800ms.
- Entry +1200ms: dissolve into actual Home and replay its text reveal.
- Entry +1800ms: remove overlay and restore page interaction.

Enter/Space activates the ribbon, Escape or Skip intro bypasses the scene. Tab stays in the modal; background is inert and scrolling locked only while the intro is present. Reduced motion uses a 200ms dissolve without camera movement. Once per browser tab/session; append `?entrance=1` to replay for review.
