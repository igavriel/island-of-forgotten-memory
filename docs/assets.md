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
  ui/           # shared UI images (buttons, frames, icons)
  map/          # treasure map backgrounds/decorations
```

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
- Sizing is handled by minimal CSS classes in [css/style.css](../css/style.css):
  `.map-clue-image`, `.island-background`, `.character-image`, `.lose-image`.
- Alt text: informative images (map clues, characters) use the riddle's label/name;
  decorative images (backgrounds, lose art) use empty alt.
