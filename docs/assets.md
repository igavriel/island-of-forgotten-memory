# Asset Integration Guide

How to replace the emoji/text placeholders with real images later. The game stays fully
static: images are plain files referenced by path, loaded directly from disk.

## Current status (Phase 7A)

The image pipeline has been proven with temporary SVG placeholders:

- Only the `gold` and `parrot` riddles currently have image assets (simple SVG placeholders
  under `assets/hints`, `assets/islands`, `assets/characters`, `assets/endings`).
- All other riddles intentionally keep their image fields `null` and fall back to the
  emoji/text placeholders (this is the supported "mixed mode").
- Images are used automatically wherever a riddle provides a path. `CONFIG.USE_IMAGE_ASSETS`
  defaults to `true` and is an optional override: set it to `false` to force placeholder-only
  mode (ignore all image paths) for testing. With the default, `gold` and `parrot` render
  their SVGs while every other riddle keeps showing emoji/text.
- These SVGs are temporary developer placeholders, not final art. Full art integration
  (real images for all riddles) is future work.

Images can be SVG or raster (PNG/JPG); both are plain static files. SVG is convenient for
lightweight placeholders because it scales cleanly inside the existing CSS sizing.

## Folders

```
assets/
  hints/        # map clue images        (per riddle)
  islands/      # island background images (per riddle)
  characters/   # questioner images       (per riddle)
  endings/      # lose/win images
  ui/           # shared UI images (buttons, frames, icons, cursor)
  map/          # treasure map backgrounds/decorations
```

## Custom cursor

- **Asset:** `assets/ui/pirate_hook_cursor.svg` (48×48, transparent, hook tip at top-left).
- **Applied in:** [css/style.css](../css/style.css) on `body`, `#app`, `#game-viewport`, `#screen`, and all buttons
  (`.main-button`, `.option-button`, `.debug-button`):
  `cursor: url("../assets/ui/pirate_hook_cursor.svg") 6 6, pointer;`
- **Hotspot:** `6 6` aligns with the hook tip. If clicks feel offset, change those two
  numbers in every cursor rule in `css/style.css` to match the tip's x/y in the SVG.
- **Disable:** remove or comment out the cursor rules in `css/style.css`, or override with
  `cursor: pointer` on `body` / `button`.
- **Replace:** drop in a new SVG at the same path (keep a clear tip and update the hotspot),
  or point the `url(...)` at a new file.

## Full-screen background rules

All screen-level 16:9 backgrounds (start, map, sailing, victory) and per-riddle
`islandBackgroundImage` / `loseImage` render on `#screen-bg` **inside `#game-viewport`**
(not the full browser window). Styled with `.fullscreen-art-background` in
[css/style.css](../css/style.css):

| Property | Value | Purpose |
| -------- | ----- | ------- |
| `background-size` | `contain` | Fill the 16:9 viewport without distortion or cropping |
| `background-position` | `center` | Center the image |
| `background-repeat` | `no-repeat` | Single image |

## 16:9 game viewport

The game uses a letterboxed 16:9 viewport so backgrounds always display at the correct
aspect ratio:

```
#app (full window, flex center, letterbox color)
  └── #game-viewport (exactly 16:9, fits inside window)
        ├── #screen-bg (background images)
        └── #screen (UI root — renderer injects screens here)
```

- **Sizing:** `width: min(100vw, calc(100dvh * 16 / 9))` and
  `height: min(100dvh, calc(100vw * 9 / 16))` with `aspect-ratio: 16 / 9`.
- **Letterboxing:** when the browser window is wider or taller than 16:9, neutral bars appear
  outside the viewport (`--letterbox-bg` in `:root`, default `#071827`). Change that variable
  in [css/style.css](../css/style.css) to adjust the outer color.
- **Backgrounds:** because `#game-viewport` is already 16:9, `contain` shows the full SVG with
  no stretch and no crop. Do not size backgrounds against `100vw`/`100vh` directly.
- **UI:** map clues, sailing ship/island sprites, and text overlays are positioned relative to
  `#game-viewport` (percentages), not the browser window.

**Authoring SVG placeholders:** use `viewBox="0 0 1920 1080"`. Safe margins are still good
practice but `contain` inside a 16:9 viewport will show the full image.

**Adjust sizing mode:** edit `.fullscreen-art-background` in `css/style.css` — `contain`
(default) vs `cover` (only if you accept edge cropping on the viewport).

## Sailing transition placeholders

Between islands the game shows a short sailing screen (`renderSailing` in
[js/renderer.js](../js/renderer.js)) with a full-screen sea background plus foreground sprites.

- **Background:** `assets/ui/sailing_background_placeholder.svg` — configured as
  `CONFIG.SAILING_BACKGROUND_IMAGE` (same `#screen-bg` / `.fullscreen-art-background` rules as
  start/map/win).
- **Ship:** `assets/ui/sailing_ship_placeholder.svg` — configured as `CONFIG.SAILING_SHIP_IMAGE`.
- **Destination island:** `assets/ui/destination_island_placeholder.svg` — configured as
  `CONFIG.SAILING_DESTINATION_ISLAND_IMAGE`.
- **Text:** Hebrew message and progress render as plain text over the sky (`text-shadow` only —
  no panel/card).
- **Timing:** `CONFIG.SAILING_TRANSITION_MS` (default `1800` ms). This value drives both the
  JavaScript `setTimeout` that advances to the next island and the CSS `--sail-ms` variable
  used by the `.sailing-ship` animation (`applyAnimationTimings` at startup). Change it in
  one place in [config/config.js](../config/config.js) to speed up or slow down the crossing.
- **Motion:** the ship moves right-to-left (RTL feel: starts off-screen right, stops near the
  island on the left). Vertical bobbing is a **sine-like wave approximated with CSS
  keyframes** (`@keyframes sailing-ship-wave` in [css/style.css](../css/style.css)), not a true
  mathematical sine path.
- **Fallback:** if `USE_IMAGE_ASSETS` is false or an SVG fails to load, the ship falls back to
  ⛵ and the island to 🏝️ (via `appendVisual`); the transition still runs. If
  `USE_SCREEN_PLACEHOLDER_IMAGES` is false or the sailing background fails, the body sea
  gradient shows through.
- **Replace later:** swap in final art at the same paths (or update the config keys); keep
  transparent backgrounds on foreground sprites and safe margins on 16:9 backgrounds.

## Two kinds of images

1. **Per-riddle images** (`hintImage`, `islandBackgroundImage`, `characterImage`,
   `loseImage` on each riddle) — described below. Used automatically when present (gated by
   `USE_IMAGE_ASSETS`). Two of these render inline and two render as full-screen backgrounds:
   - `hintImage` — small inline image inside the map clue card (`.map-clue-image`).
   - `characterImage` — inline character portrait on the island (`.character-image`).
   - `islandBackgroundImage` — **16:9 full-screen background** behind the island question.
   - `loseImage` — **16:9 full-screen background** behind the lose screen.
   The full-screen ones use the same `#screen-bg` layer and `setScreenBackground()` as the
   screen-level images below, so they should be authored at 16:9 (`viewBox="0 0 1920 1080"`)
   with a readable center. Riddles without these paths fall back to the sea gradient, and the
   island/lose emoji markers always show.
2. **Screen-level backgrounds** (full-screen 16:9 images) — configured in `config/config.js` and
   gated by `USE_SCREEN_PLACEHOLDER_IMAGES`:
   - `START_SCREEN_IMAGE` -> `assets/ui/start_screen_placeholder.svg` (start screen)
   - `MAP_BACKGROUND_IMAGE` -> `assets/map/treasure_map_placeholder.svg` (memory/map phase)
   - `SAILING_BACKGROUND_IMAGE` -> `assets/ui/sailing_background_placeholder.svg` (sailing transition)
   - `VICTORY_IMAGE` -> `assets/endings/victory_placeholder.svg` (win screen)

   They are rendered on `#screen-bg` inside `#game-viewport` (`.fullscreen-art-background`,
   `background-size: contain`) by `setScreenBackground()`. Start/map/win text sits on translucent
   panels; the sailing message is plain text over the sky (`text-shadow` only). Decorative only:
   - The map background does **not** contain fixed clues. The selected route clues are still
     rendered dynamically on top of it from `selectedRiddles` in the map card.
   - The island and lose screens use the current riddle's full-screen background when it has
     one (see per-riddle images above), otherwise the viewport fallback gradient shows.
   - If a screen image is missing or fails to load, the layer stays empty and the screen still
     works. Set `USE_SCREEN_PLACEHOLDER_IMAGES: false` to turn all four off.

   To use final art later, just replace these SVG files (or point the config paths at new
   16:9 files); no renderer or layout changes are needed.

## Recommended naming

Name files after the riddle `id` (see [config/riddles.js](../config/riddles.js)):

| Field                   | Folder              | Suggested file name      |
| ----------------------- | ------------------- | ------------------------ |
| `hintImage`             | `assets/hints/`     | `<id>.png`               |
| `islandBackgroundImage` | `assets/islands/`   | `<id>.png`               |
| `characterImage`        | `assets/characters/`| `<id>.png`               |
| `loseImage`             | `assets/endings/`   | `lose_<id>.png`          |

Example for the `gold` riddle: `assets/hints/gold.png`, `assets/islands/gold.png`,
`assets/characters/gold.png`, `assets/endings/lose_gold.png`.

## Connect an image to a riddle

In [config/riddles.js](../config/riddles.js), set the matching field on the riddle to the file path
(fields default to `null`, which means "use the emoji/text placeholder"):

```javascript
{
  id: "gold",
  hintEmoji: "🪙",
  hintLabel: "מטבע זהב",
  hintImage: "assets/hints/gold_chest.svg",
  islandBackgroundImage: "assets/islands/gold_island.svg",
  characterImage: "assets/characters/gold_guard.svg",
  loseImage: "assets/endings/lose_gold.svg",
  // ...rest unchanged
}
```

This is exactly how the `gold` and `parrot` riddles are wired today (see
[config/riddles.js](../config/riddles.js)). File names can follow the riddle `id` or be more
descriptive (e.g. `gold_chest.svg`); only the path in the riddle field needs to match.

## Image mode and the placeholder override

Images are used automatically wherever a riddle provides a path, so you can add them
gradually: fill a riddle's path and it renders; riddles left `null` (or any file that fails
to load) keep showing the emoji/text placeholder (no broken images).

In [config/config.js](../config/config.js):

- `USE_IMAGE_ASSETS: true` (default) — use images wherever a path exists, with automatic
  emoji/text fallback otherwise.
- `USE_IMAGE_ASSETS: false` — optional override that forces placeholder-only mode (ignores
  all image paths), handy for testing the fallback look.
- `SHOW_HINT_LABELS_ON_MAP: false` — optional, for final image-only map clues (hides the text labels).

## Notes

- Keep file sizes small; everything loads from disk with no build step.
- Inline images are sized by minimal CSS classes in [css/style.css](../css/style.css):
  `.map-clue-image` (map clue) and `.character-image` (character portrait).
- Full-screen background images are drawn by `#screen-bg` inside `#game-viewport` with
  `background-size: contain` (no distortion, no crop within the 16:9 viewport).
- Alt text: informative inline images (map clues, characters) use the riddle's label/name.
  Full-screen backgrounds are decorative and set via CSS, so they need no alt text.
