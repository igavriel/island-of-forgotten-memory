# Asset Integration Guide

How to replace the emoji/text placeholders with real images later. The game stays fully
static: images are plain files referenced by path, loaded directly from disk.

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
  hintImage: "assets/hints/gold.png",
  islandBackgroundImage: "assets/islands/gold.png",
  characterImage: "assets/characters/gold.png",
  loseImage: "assets/endings/lose_gold.png",
  // ...rest unchanged
}
```

## Switch from placeholders to image mode

In [js/config.js](../js/config.js):

- `USE_IMAGE_ASSETS: true` — use images wherever a riddle provides a path. Any riddle field
  left `null`, or any file that fails to load, automatically falls back to the emoji/text
  placeholder (no broken images).
- `SHOW_HINT_LABELS_ON_MAP: false` — optional, for final image-only map clues (hides the text labels).

You can add images gradually: set `USE_IMAGE_ASSETS: true` and fill paths one riddle at a
time; the rest keep showing placeholders until you add their files.

## Notes

- Keep file sizes small; everything loads from disk with no build step.
- Sizing is handled by minimal CSS classes in [css/style.css](../css/style.css):
  `.map-clue-image`, `.island-background`, `.character-image`, `.lose-image`.
- Alt text: informative images (map clues, characters) use the riddle's label/name;
  decorative images (backgrounds, lose art) use empty alt.
