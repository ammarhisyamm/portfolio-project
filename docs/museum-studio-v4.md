# Museum v4: character detail, studio wing, cat and ribbon cut

## Character
`lib/museum/avatar.ts` now follows the v4 turnaround / pose sheets more closely. Still a procedural, skinned native mesh (no new dependencies):

- Curly black hair: ~150 rolled curls (`curlLock`) over a sculpted cap, a fringe tumbling over the brow and short curled sides.
- Larger eyes with highlights, darker brows, a small smile, thin round frames with a keyhole bridge.
- Black chunky knit with ribbed hem, cuffs and crew neck, white shirt collar points and shirt hem.
- Dark brown-charcoal cargo trousers: thigh and shin cargo pockets with flaps and topstitching, rolled hems.
- Cream retro runners (`sneakerPart` remaps a sphere into a shoe last): outsole, chunky midsole, grey suede toe/heel/saddle overlays, laces, padded collar and a side "N"-style logo.
- Dark brown leather rucksack: buckled top flap, stitched front pocket with gold "h", side pockets with buckles, studs, handle; shoulder straps with chest buckles.
- Interact pose now reaches out and up toward the exhibit and turns the head; walk/run add torso counter-rotation; idle has a light weight shift.

`public/museum/hisyam-character-v3.glb` was not regenerated; rebuild it with `scripts/export-museum-avatar.mjs` if the downloadable asset should match.

## Studio wing (bigger room + hidden finds)
A side door in the hall's west wall (plaque: "the studio — curious visitors welcome") opens into a second room (`lib/museum/studio.ts`, ~15.6 × 21.4 units): parquet floor, sage walls, beamed ceiling, an arched window, four bookshelves with instanced books, a reading nook (rug, armchair, floor lamp, sofa, coffee table), a desk with laptop and lamp, a fig tree, a record cabinet, a photo pinboard and a cat bed. It is in the minimap but not the top navigation.

Hidden finds are small objects that glint only when the visitor is close; `E` (or clicking) opens them. Their text comes from existing CMS fields only (`lib/museum/content.ts` → `museumSecrets`), and a find is omitted when its field is empty: about.background (journal), about.industries (book on the shelf), exploration (sketchbook), about.cvUrl (papers on the desk), about.gallery (pinboard photos), trust (note in the olive planter, main hall), hero headline/intro (note under the bust, main hall), plus the cat. Progress ("n/total hidden finds") is kept per browser session.

## Cat
`lib/museum/cat.ts`: a procedural ginger tabby that loafs in its bed, wanders between spots in the studio along collision-safe paths, sits and watches the visitor when they come close, and purrs with hearts and an upright tail when petted (`E`). Reduced motion keeps it still.

## Ribbon cut
The scissors no longer sweep along the ribbon with open blades. They slide onto the fabric at the chosen point, squeeze shut (accelerating easing), reopen, push a little deeper and close through; a slit grows with each bite and the ribbon gives slightly under the blades. The end of the slit animation releases the ribbon (with a timeout fallback). Implemented with the Web Animations API in `HomeEntrance.tsx`.

## Fix
The museum frame loop could start with a negative delta (rAF timestamp earlier than the setup `performance.now()`), which briefly threw the camera and, with reduced motion, left the avatar stuck in the reach pose. The delta is now clamped at 0.
