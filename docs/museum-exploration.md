# Interactive portfolio museum

The home page now offers a real, navigable Three.js scene after the existing ribbon-cutting entrance. It is a stylized heritage museum, not a flat background with pretend movement. Art direction follows the supplied warm brass, marble, arched-window, glass-display and third-person visitor references. The native-geometry character has glasses, swept hair, dark clothing, white shoes and a monogrammed backpack. This implementation is intentionally stylized rather than a photorealistic imported character.

## Content and navigation

There is no duplicated content store or new database schema. `lib/museum/content.ts` derives the exhibition from the existing `SiteContent` fetched by the home page:

- Selected work: three published projects, ordered by featured status and CMS order, plus access to all published case studies.
- Process: existing experience entries and their real descriptions/images. No fictitious blog articles are added.
- Playground: existing exploration artwork, linking to the full gallery.
- About: introduction, philosophy, photos, capabilities and tools.
- Contact: the actual contact email and note, linking to the contact page.

WASD / arrow keys move; Shift runs; pointer drag changes the camera; E inspects a nearby display; clicking an exhibit also opens it. Wheel adjusts viewing distance. Room navigation and map buttons guide the character along an occupancy-grid path around display cases. Mobile visitors get a movement joystick, hold-to-run control, and camera drag. Controls stop while an exhibit or case study is open. A classic view is always available and remains the fallback if WebGL cannot initialize.

`?entrance=1` replays the existing intro and enters the museum. `?museum=1` selects the museum; `?view=classic` selects the conventional portfolio. The view preference is session-only.

## Rendering and motion

The Three.js module is dynamically imported only for an active museum view. Static architecture is batched by material and shadow state; vegetation is instanced. Desktop uses a limited-resolution planar floor reflection; coarse pointers / small screens omit that pass and use lower pixel ratio and shadow resolution. The scene pauses when the tab is hidden, during the introduction, and behind content dialogs. Geometry, textures, listeners, animation loop, reflector and renderer are disposed on view change / navigation.

Movement acceleration and camera damping are frame-rate independent. Guided travel uses collision-safe waypoints rather than moving through plinths. Reduced-motion visitors get immediate destination changes and camera positioning, no animated dust or idle gestures, and no CSS entry motion. Manual exploration remains available. Native exhibit dialogs provide modal focus behavior; the case-study layer traps focus and returns it on close. The conventional shell is hidden and inert while the 3D presentation is active.

## Generated material

One raster material was generated with the built-in image-generation tool, using the user's museum image as a style reference only. The selected source was optimized into `public/museum/emperador-marble.webp` (1024 × 1024). The architecture, character, display cases, vegetation and interaction are constructed in code; no screenshot UI is baked into the scene.

Generation prompt:

> Use case: stylized-concept. Asset type: ONE tileable PBR marble ALBEDO texture for the floor and plinths of a navigable Three.js museum. Input image is STYLE REFERENCE ONLY, never copy the website UI or scene composition. Generate a square, top-down orthographic close-up of warm near-black polished dark Emperador marble with elegant fine pale-gold and dark amber mineral veins, a few muted ivory hairline seams, deep espresso charcoal base. Museum material matching the supplied golden museum reference. Natural varied veins across the whole image, subtle stone grain, believable geological detail. Texture must TILE SEAMLESSLY across all four edges. Flat neutral diffuse illumination, no specular highlights, no reflections of room or objects, no baked directional lights, no perspective, no borders, no UI, no text, no frames, no people. Large-scale fine mineral character, no overly dense white cracks. A clean usable production material texture, not a room rendering.
