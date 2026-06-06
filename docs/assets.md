# Asset Guide

The game uses static image files and generated questions from [config/assets.js](../config/assets.js).

## Asset categories

Each category in `ASSET_CATEGORIES` defines:

- `question1` and `question2`
- `islandImage` (island sprite on sailing and question screens for this category)
- `islandEmoji`
- `islandTitle`
- `characterEmoji`
- `characterName`
- `failTitle`
- `assets`, the image list for that category

Each image asset defines:

- `category`
- `path`
- `answer1`
- `answer2`

At the start of a run, the game selects one random asset from each category configured in
`CONFIG.MAP_ASSET_LAYOUT`.

## Map placement

Map placement is configured in [config/config.js](../config/config.js):

```javascript
MAP_ASSET_LAYOUT: {
  volcano: {
    x: 50,
    y: 50,
    sizePercent: 24,
  },
}
```

`x`, `y`, and `sizePercent` are relative percentages inside the rendered map image.
Image height is automatic, so proportions are preserved.

## Folders

```text
assets/
  characters/   # category images used on the map
  map/          # treasure map images
  ui/           # shared UI and transition images
  endings/      # victory images (loss uses assets/endings/ending_screen.png via CONFIG)
```

## Screen images

Configured in `CONFIG`:

- `START_SCREEN_IMAGE`
- `MAP_BACKGROUND_IMAGE`
- `MAP_FLY_FRAMES` (ordered sprite frames for the map fly-away)
- `MAP_FLY_FRAME_MS` (milliseconds per fly frame)
- `LOSE_SCREEN_IMAGE` (shared background for every wrong answer)
- `SAILING_BACKGROUND_IMAGE` (sailing screen sea background)
- `QUESTION_BACKGROUND_IMAGE` (fallback island sprite when a category has no `islandImage`)
- `VICTORY_IMAGE`
- `SAILING_SHIP_IMAGE`
- `SAILING_SHIP_TRAVEL_MS` (milliseconds per ship move)
- `SAILING_SHOW_LAYOUT_GUIDES` (dashed circle guides for layout tuning; hidden in normal play)
- `SAILING_LAYOUT.sea` — rectangle: `x`, `y`, `widthPercent`, `heightPercent` (center + size as % of scene)
- `SAILING_LAYOUT.island` / `.ship` / `.dock` — circles: `x`, `y`, `sizePercent` (center + diameter as % of scene width)

Tune sailing positions in Krita against `sailing_background.png` (1672×941): see
[sailing-layout-krita.md](sailing-layout-krita.md).

All images are plain static paths. The renderer uses an image whenever a path is set; if a file is missing or fails to load, the game falls back to emoji/text without a backend or build step.

## Cursor

The custom cursor is `assets/ui/hook-64x64.svg`, configured in [css/style.css](../css/style.css).
The hotspot is `6 6`.
