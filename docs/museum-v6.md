# Museum v6: candle-lit halls, Hisyam from the character sheet, new Nailong, ginger cat

## Lighting
The halls follow the warm concept frames: dark marble, glowing brass, pools of candle light.

- `lib/museum/environment.ts`: amber sun, hemisphere and rim lights; brighter lanterns and spots (the east lanterns now light up on desktop too); a chandelier light over the crossing; candle sconces with flickering flames along both side walls; a glowing cove line under each cornice; four window light shafts on desktop instead of two; brass with a little emissive glow; warmer window glass and floor reflection.
- `lib/museum/scene.ts`: darker warm background and fog, slightly higher exposure, a stronger bloom, and a grade pass between bloom and output (amber shadows, golden highlights, soft vignette). Mobile still renders without the composer.
- `lib/museum/exhibits.ts`: the lectern's warm strip sits under a marble cap so it reads as a seam of light, not a lit slab.

## Hisyam (`lib/museum/avatar.ts`)
Rebuilt against the character sheet, same bones, same API.

- Face: larger head, oval skull with a soft jaw, rounded chin and small nose; brown eyes with glints under real lids and lashes, thick brows, round thin glasses, a small smile and a hint of blush.
- Hair: wavy, side-swept and voluminous, made of layered swept locks (back, sides over the ears, top, fringe, crown) instead of the old curls.
- Outfit: black rib-knit sweater over a white tee, charcoal cargo trousers with a pocket seam, cargo pocket and rolled cuffs, socks, chunky trainers, a dark leather backpack with buckles, studs and a gold "h".
- Poses: idle with hands in the pockets, walk and run swing, a slow look around while standing, pointing at the inspected display, and a hand on the chin while thinking.

## Nailong (`lib/museum/nailong.ts`)
Reshaped to the new turnaround and expression sheet: lemon yellow all over with orange cheeks, big glossy black eyes with a green ring, a big cream belly, tiny brown claws (no pink pads) and a tail that curls up at the tip.

- Mouth shapes: closed smile, open D-grin, round open mouth, frown.
- Moods map to the sheet: `neutral` (Biasa), `talk` (Disapa), `happy` (Senang), `cheer` (Sorak), `grumpy` (Ngambek), `surprised` (Kaget).
- New gestures `chest` (both paws to the chest) and `gasp` (one paw) join `idle`, `wave`, `cheer` and `reach`.

## Cat (`lib/museum/cat.ts`)
A realistic ginger tabby instead of the toy cat: one continuous body with tabby stripes, a pale underside and white chest, a white muzzle, white socks, amber slit eyes, whiskers, and a ringed tail with a dark tip. It walks with alternating legs, sits with its haunches tucked, and loafs while purring.
