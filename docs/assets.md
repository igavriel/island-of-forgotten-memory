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
- **Applied in:** [css/style.css](../css/style.css) on `body`, `#game`, and all buttons
  (`.main-button`, `.option-button`, `.debug-button`):
  `cursor: url("../assets/ui/pirate_hook_cursor.svg") 6 6, pointer;`
- **Hotspot:** `6 6` aligns with the hook tip. If clicks feel offset, change those two
  numbers in every cursor rule in `css/style.css` to match the tip's x/y in the SVG.
- **Disable:** remove or comment out the cursor rules in `css/style.css`, or override with
  `cursor: pointer` on `body` / `button`.
- **Replace:** drop in a new SVG at the same path (keep a clear tip and update the hotspot),
  or point the `url(...)` at a new file.

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
2. **Screen-level backgrounds** (full-screen 16:9 images) — configured in `js/config.js` and
   gated by `USE_SCREEN_PLACEHOLDER_IMAGES`:
   - `START_SCREEN_IMAGE` -> `assets/ui/start_screen_placeholder.svg` (start screen)
   - `MAP_BACKGROUND_IMAGE` -> `assets/map/treasure_map_placeholder.svg` (memory/map phase)
   - `VICTORY_IMAGE` -> `assets/endings/victory_placeholder.svg` (win screen)

   These three are **16:9 full-screen background placeholders** (`viewBox="0 0 1920 1080"`),
   designed with a readable center. They are rendered as a fixed full-screen layer behind the
   game (`#screen-bg`, `background-size: contain` — full image visible, proportional fit) by `setScreenBackground()` in the renderer;
   text and buttons sit above them on translucent panels/cards, with a subtle scrim for
   contrast. They are decorative only:
   - The map background does **not** contain fixed clues. The selected route clues are still
     rendered dynamically on top of it from `selectedRiddles` in the map card.
   - The island and lose screens use the current riddle's full-screen background when it has
     one (see per-riddle images above), otherwise the sea gradient. The sailing screen always
     uses the sea gradient.
   - If a screen image is missing or fails to load, the layer stays empty and the screen still
     works. Set `USE_SCREEN_PLACEHOLDER_IMAGES: false` to turn all three off.

   To use final art later, just replace these three SVG files (or point the config paths at new
   16:9 files); no renderer or layout changes are needed.

## Recommended naming

Name files after the riddle `id` (see [js/riddles.js](../js/riddles.js)):

| Field                   | Folder              | Suggested file name      |
| ----------------------- | ------------------- | ------------------------ |
| `hintImage`             | `assets/hints/`     | `<id>.png`               |
| `islandBackgroundImage` | `assets/islands/`   | `<id>.png`               |
| `characterImage`        | `assets/characters/`| `<id>.png`               |
| `loseImage`             | `assets/endings/`   | `lose_<id>.png`          |

Example for the `gold` riddle: `assets/hints/gold.png`, `assets/islands/gold.png`,
`assets/characters/gold.png`, `assets/endings/lose_gold.png`.

## Connect an image to a riddle

In [js/riddles.js](../js/riddles.js), set the matching field on the riddle to the file path
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
[js/riddles.js](../js/riddles.js)). File names can follow the riddle `id` or be more
descriptive (e.g. `gold_chest.svg`); only the path in the riddle field needs to match.

## Image mode and the placeholder override

Images are used automatically wherever a riddle provides a path, so you can add them
gradually: fill a riddle's path and it renders; riddles left `null` (or any file that fails
to load) keep showing the emoji/text placeholder (no broken images).

In [js/config.js](../js/config.js):

- `USE_IMAGE_ASSETS: true` (default) — use images wherever a path exists, with automatic
  emoji/text fallback otherwise.
- `USE_IMAGE_ASSETS: false` — optional override that forces placeholder-only mode (ignores
  all image paths), handy for testing the fallback look.
- `SHOW_HINT_LABELS_ON_MAP: false` — optional, for final image-only map clues (hides the text labels).

## Notes

- Keep file sizes small; everything loads from disk with no build step.
- Inline images are sized by minimal CSS classes in [css/style.css](../css/style.css):
  `.map-clue-image` (map clue) and `.character-image` (character portrait).
- Full-screen background images (`islandBackgroundImage`, `loseImage`, and the three
  screen-level images) are drawn by the fixed `#screen-bg` layer with `background-size: contain`
  (proportional fit, no cropping),
  so author them at 16:9 with a readable center.
- Alt text: informative inline images (map clues, characters) use the riddle's label/name.
  Full-screen backgrounds are decorative and set via CSS, so they need no alt text.
