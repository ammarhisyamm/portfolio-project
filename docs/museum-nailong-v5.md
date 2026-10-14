# Museum v5: Nailong doorkeeper, simpler avatar, tidier galleries

## Nailong
`lib/museum/nailong.ts` builds Nailong procedurally from the reference images (no new dependencies, no image-to-3D): an egg-shaped head with chubby jowls and a soft snout, green eyes with glints under real eyelids, a cream belly, stubby arms with pink pads and brown claws, short legs and a tapered tail. Colors are vertex-painted lemon yellow, warmer toward the feet.

- Moods: `neutral`, `talk` (greeting), `happy` (closed smiling eyes), `cheer`, `grumpy` (frowning lids), `surprised`.
- Gestures: `idle`, `wave`, `cheer`, `reach` (used to hold the scissors at the ribbon), plus walking, blinking and look-at.
- It is fan art of a character someone else owns; swap it out if the site ever needs fully original IP.

## Entrance: Nailong cuts the ribbon
`lib/museum/entrance-stage.ts` draws Nailong on a transparent WebGL canvas over the 2D entrance. Nailong greets the visitor ("Hi, I'm Nailong! Pick a spot and I'll cut the ribbon."), looks at the spot the pointer hovers, walks there when the visitor clicks, raises the scissors to the ribbon (the arm angle is solved so the blades meet the fabric at the chosen point) and snips with the same timing as the fabric slit. Then Nailong cheers, steps aside and waves while the doors open. If WebGL or the module fails to load within 4 s, the old SVG scissors run instead.

## Museum: Nailong at the door
Nailong stands by the entrance doors inside the museum. The visitor starts facing Nailong; after a moment the view turns toward the hall (skipped with reduced motion, which starts facing the hall). Close up, Nailong waves and says "Hi there! Can I help you find something?". `E` or a click opens a small dialog with the rooms; picking one walks the visitor there. Poking Nailong three times quickly makes it grumpy.

## Avatar
`lib/museum/avatar.ts` is now a simple toy figure built from rigid parts on the same bones (same API and animation), instead of the sculpted v3 mesh. `lib/museum/avatar-geometry.ts` was removed. `public/museum/hisyam-character-v3.glb` was not regenerated.

## Layout
Following common gallery planning (an entrance foyer, a clear circulation spine, works hung on the walls, sightline to a focal piece at the end), the hall is now:

- Foyer: Nailong, the collection lectern.
- Gallery 1 (arches at z 5 and -11): Selected work on the west wall, Playground on the east.
- Gallery 2: About on the west wall beside the studio door, Process on the east.
- Contact as a low desk at the end of the axis, in front of the apse window.

Cases are 18% smaller and stand against the side walls, so the central aisle stays open from the doors to Contact. A room with fewer pieces than slots keeps them centered. Each gallery has a numbered wall title and a spotlight; two wayfinding totems and a central bench sit on the aisle. The floor reflects less of the studio-light environment, which used to read as glare in front of the doors.
