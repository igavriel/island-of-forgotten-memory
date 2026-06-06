# Tuning `SAILING_LAYOUT`

## Easiest: browser layout picker (Chrome DevTools)

No Krita or manual pixel math. The game can log layout values directly from
clicks on the sailing screen.

### Enable picker mode

In [config/config.js](../config/config.js):

```js
SAILING_LAYOUT_PICKER: true,
SAILING_SHOW_LAYOUT_GUIDES: true,  // optional but recommended
```

| Flag | Effect |
| --- | --- |
| `SAILING_LAYOUT_PICKER` | Turns on click-to-log mode on the sailing screen. **Required** for the picker. |
| `SAILING_SHOW_LAYOUT_GUIDES` | Draws dashed sea / island / ship / dock guides. Also shown when `SAILING_LAYOUT_PICKER` or `DEBUG_MODE` is on. |
| `DEBUG_MODE` | Shows correct answers and other dev aids. Does **not** enable the layout picker. |

While `SAILING_LAYOUT_PICKER` is `true`, sailing gameplay is disabled on that
screen (no ship movement, no island advance). Only layout measurement works.

### Open DevTools

1. Open `index.html` in Chrome (or any Chromium browser).
2. Start a game and reach the **sailing** screen (after the treasure map).
3. Open the console:
   - Windows / Linux: **F12** or **Ctrl+Shift+J**
   - macOS: **Cmd+Option+J**
4. Select the **Console** tab.

### Coordinate system

Clicks are converted to percentages of the `.sailing-scene` box (the 16:9 sailing
viewport):

- `x` — horizontal position, **0 = left edge**, **100 = right edge**
- `y` — vertical position, **0 = top edge**, **100 = bottom edge**

All layout slots use **center** coordinates (`translate(-50%, -50%)` in CSS).

| Slot | Fields | How sizes work |
| --- | --- | --- |
| `sea` | `x`, `y`, `widthPercent`, `heightPercent` | `widthPercent` is % of scene **width**; `heightPercent` is % of scene **height** |
| `island`, `ship`, `dock` | `x`, `y`, `sizePercent` | `sizePercent` is circle **diameter** as % of scene **width** (not height) |

Island and ship **images are not clipped** to the guide circle. The circle sets
the layout anchor; artwork may extend beyond it. Tune `sizePercent` by eye after
placing centers.

### Measure centers (island, ship, dock)

**Click** (without Shift) on the center you want.

The console prints lines prefixed with `[SAILING_LAYOUT]`, for example:

```
[SAILING_LAYOUT] Click point: { x: 18.2, y: 71.5 }
Island: island: { x: 18.2, y: 71.5, sizePercent: 30 }
Ship:   ship: { x: 82.1, y: 65.3, sizePercent: 18 }
Dock:   dock: { x: 34.0, y: 65.1, sizePercent: 18 }
```

- `x` and `y` come from your click.
- `sizePercent` is copied from the **current** `SAILING_LAYOUT` entry. The
  picker does not measure size — adjust `sizePercent` manually and reload until
  the dashed guide circle fits the art.

Repeat clicks for island, ship, and dock; copy the snippet you need into
`config.js`.

### Measure the sea rectangle

**Shift+click** one corner of the sea click zone, then **Shift+click** the
opposite corner. Order does not matter.

After the second Shift+click, the console prints:

```
[SAILING_LAYOUT] Sea rectangle: { x: 50, y: 68, widthPercent: 92, heightPercent: 55 }
Paste into SAILING_LAYOUT: sea: { x: 50, y: 68, widthPercent: 92, heightPercent: 55 }
```

The tool builds a center-based rectangle from the two corners (min/max of `x`
and `y`). If you mis-click, reload the page to reset the first sea corner.

### On-screen HUD

A small English HUD at the bottom of the sailing screen mirrors the last action
(click point or sea rectangle). Values are also always written to the console.

### Finish tuning

1. Paste measured values into `SAILING_LAYOUT` in [config/config.js](../config/config.js).
2. Set `SAILING_LAYOUT_PICKER: false`.
3. Set `SAILING_SHOW_LAYOUT_GUIDES: false` for normal play.
4. Reload the page and test sailing (sea click moves ship; island click docks).

Suggested order: **sea** (Shift+clicks) → **island** → **ship** → **dock** →
tweak `sizePercent` values with guides still on.

---

## Alternative: Krita overlay

Use this section if you prefer measuring on
`assets/ui/sailing_background.png` in Krita and copying numbers into
`CONFIG.SAILING_LAYOUT` in [config/config.js](../config/config.js).

## Canvas size

`sailing_background.png` is **1672 × 941** pixels (effectively 16:9). The game
renders it inside a 16:9 viewport, so percentages measured on this file map
directly to `SAILING_LAYOUT` without resizing the image in Krita.

| Reference | Pixels | Percent |
| --- | ---: | ---: |
| Canvas width `W` | 1672 | 100% |
| Canvas height `H` | 941 | 100% |
| Scene center | 836, 470.5 | 50%, 50% |
| 10% step (width) | 167.2 | 10% |
| 10% step (height) | 94.1 | 10% |
| 1% step (width) | 16.72 | 1% |
| 1% step (height) | 9.41 | 1% |

## Krita setup

1. Open `assets/ui/sailing_background.png` in Krita (canvas stays **1672 × 941**).
2. **File → Save as** → e.g. `sailing_layout.kra` so guide layers are easy to reopen.
3. Add a **Vector Layer** named `zones`.
4. Optional grid: **Settings → Configure Krita → Grid**
   - Horizontal spacing: **94.1** (≈10% of height)
   - Vertical spacing: **167.2** (≈10% of width)
   - **View → Show Grid** while drawing.

## Draw the four zones

Use the **Add Shape** tool on the vector layer. Semi-transparent strokes are fine.

| Zone | Shape | Stroke color | Covers |
| --- | --- | --- | --- |
| Sea | Rectangle | Blue | Water only (not sky / beach) |
| Island | Ellipse | Green | Island art |
| Ship | Ellipse | Yellow | Ship **start** position and width |
| Dock | Ellipse | Orange | Where the ship **stops** when the island is clicked |

Tune order: **sea → island → ship → dock**. The dock ellipse should sit on the
shore, usually a bit to the right of the island center.

## Read positions in Krita

Select a shape with the **Shape Selection Tool** or **Transform Tool**.

Krita shows a bounding box. Note:

- `Tx`, `Ty` — top-left of the box (pixels)
- `W`, `H` — width and height (pixels)

Compute the **center**:

```
centerX = Tx + W / 2
centerY = Ty + H / 2
```

For circles, **diameter** = `W` (use the ellipse bounding box width).

## Convert pixels to `CONFIG.SAILING_LAYOUT`

Use **W = 1672** and **H = 941**.

### Sea (rectangle)

```
x             = (centerX / 1672) × 100
y             = (centerY / 941) × 100
widthPercent  = (W / 1672) × 100
heightPercent = (H / 941) × 100
```

### Island, ship, dock (circles)

```
x           = (centerX / 1672) × 100
y           = (centerY / 941) × 100
sizePercent = (diameter / 1672) × 100
```

`sizePercent` always uses **canvas width** (1672), same as the game engine.

Round to one decimal place when pasting into `config.js`.

## Worked example (fill in your own pixels)

Suppose in Krita the **sea** rectangle has `Tx=67`, `Ty=381`, `W=1538`, `H=518`:

| Step | Calculation | Result |
| --- | --- | ---: |
| centerX | 67 + 1538/2 | 836 |
| centerY | 381 + 518/2 | 640 |
| x | 836 / 1672 × 100 | 50.0 |
| y | 640 / 941 × 100 | 68.0 |
| widthPercent | 1538 / 1672 × 100 | 92.0 |
| heightPercent | 518 / 941 × 100 | 55.0 |

```javascript
sea: { x: 50, y: 68, widthPercent: 92, heightPercent: 55 },
```

Suppose the **island** ellipse has `W=502`, center `(301, 677)`:

| Step | Calculation | Result |
| --- | --- | ---: |
| x | 301 / 1672 × 100 | 18.0 |
| y | 677 / 941 × 100 | 71.9 |
| sizePercent | 502 / 1672 × 100 | 30.0 |

```javascript
island: { x: 18, y: 72, sizePercent: 30 },
```

## Paste into config and verify in the game

1. Copy the four objects into `SAILING_LAYOUT` in [config/config.js](../config/config.js).
2. Set `SAILING_SHOW_LAYOUT_GUIDES: true`.
3. Reload `index.html` and reach the sailing screen.
4. Compare dashed overlays (blue rect, green/yellow/orange circles) to your Krita shapes.
5. Adjust in Krita → recalculate → update config until they match.
6. Set `SAILING_SHOW_LAYOUT_GUIDES: false` for the final build.

## Conversion worksheet

Fill in from Krita, then compute config values.

| Zone | Tx | Ty | W | H | centerX | centerY | Config |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Sea | | | | | | | `sea: { x:, y:, widthPercent:, heightPercent: }` |
| Island | | | | | | | `island: { x:, y:, sizePercent: }` |
| Ship | | | | | | | `ship: { x:, y:, sizePercent: }` |
| Dock | | | | | | | `dock: { x:, y:, sizePercent: }` |

Quick formulas (copy into a calculator):

- `centerX = Tx + W/2`
- `centerY = Ty + H/2`
- `x = centerX / 16.72`  (÷ 1672 × 100, or ÷ 16.72 for direct %)
- `y = centerY / 9.41`   (÷ 941 × 100, or ÷ 9.41 for direct %)
- `widthPercent = W / 16.72`
- `heightPercent = H / 9.41`
- `sizePercent = W / 16.72` (ellipse diameter)

## Notes

- Island and ship **images may extend** outside the green/yellow guide circles; the circle sets width anchor and click area, not a hard clip.
- The **dock** circle is invisible in play unless guides are on — it only marks where the ship center stops before the next question.
- Keep `DEBUG_MODE: false` for presentation; guides are controlled by `SAILING_SHOW_LAYOUT_GUIDES` only.
