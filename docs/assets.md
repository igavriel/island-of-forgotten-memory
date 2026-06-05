# Asset Guide

The game uses static image files and generated questions from [config/assets.js](../config/assets.js).

## Asset categories

Each category in `ASSET_CATEGORIES` defines:

- `question1` and `question2`
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
  endings/      # victory / loss images
```

## Screen images

Configured in `CONFIG`:

- `START_SCREEN_IMAGE`
- `MAP_BACKGROUND_IMAGE`
- `SAILING_BACKGROUND_IMAGE`
- `VICTORY_IMAGE`
- `SAILING_SHIP_IMAGE`
- `SAILING_DESTINATION_ISLAND_IMAGE`

All images are plain static paths. If an image fails to load, the game falls back without a backend or build step.

## Cursor

The custom cursor is `assets/ui/hook-64x64.svg`, configured in [css/style.css](../css/style.css).
The hotspot is `6 6`.
