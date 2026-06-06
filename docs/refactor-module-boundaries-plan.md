# Plan: Refactor module boundaries (utils / game logic / renderer)

Work on a **feature branch**, not `main`. Goal: clearer file responsibilities
without changing gameplay, Hebrew RTL UI, or how screens look.

## Problem statement

Today the split is mostly good, but two gray zones grew over time:

1. **`renderer.js`** holds ~15 sailing/layout helpers that are pure math or
   config checks, not DOM rendering.
2. **`utils.js`** holds game-run logic (`selectRandomMapAssets`,
   `buildAssetQuestionRoute`, …) mixed with generic helpers (`shuffle`, `clamp`).

There is also dead code (`isInsideCircle`, `clampPointToCircle`) and a near
duplicate (`appendCircleImage` vs `appendVisual`).

## Goals

| Goal | Success criterion |
| --- | --- |
| Clearer modules | Each file has one primary job |
| Same behavior | Full playtest passes on branch before merge |
| Same visuals | Screens match pre-refactor layout at same viewport size |
| Course-friendly | Still plain script tags, no build step, readable functions |
| Small commits | One logical move per commit; easy to review and bisect |

## Non-goals

- No gameplay rule changes
- No CSS redesign
- No new npm/test framework
- No rename of `CONFIG` keys or asset schema
- No merge to `main` until testing section is complete

## Target structure

```
index.html
config/config.js
config/assets.js
js/utils.js           → generic helpers only
js/gameLogic.js       → NEW: map/question route generation
js/layoutGeometry.js  → NEW: percent rect/circle math (sailing + reusable)
js/renderer.js        → DOM + render* screens only
js/gameState.js       → state + flow (unchanged role)
js/main.js
```

### `js/utils.js` (after)

Keep only domain-agnostic helpers:

- `shuffle`, `pickRandom`, `pickOneRandom`
- `clamp`, `getUniqueValues`
- `buildShuffledOptions` (optional: keep here or move to `gameLogic.js`; still
  pure data, used by renderer)

### `js/gameLogic.js` (new)

Move from `utils.js`:

- `selectRandomMapAssets`
- `buildAssetQuestionRoute`
- `buildQuestionForAsset`
- `cleanGeneratedQuestion`, `cleanGeneratedQuestions`

`gameState.js` continues to call these; only the file location changes.

### `js/layoutGeometry.js` (new)

Move from `renderer.js` (pure math / no DOM):

- `formatLayoutPercent`
- `buildSeaLayoutFromCorners`
- `getRectBounds`, `isInsideRect`, `clampPointToRect`
- `getScenePercentFromEvent` (DOM read, but no mutation — keep with geometry)

**Delete** (unused today):

- `isInsideCircle`
- `clampPointToCircle`

### `js/renderer.js` (after)

Keep:

- DOM infrastructure: `getRoot`, `clearScreen`, `createElement`, `appendVisual`,
  `setScreenBackground`, `applyAnimationTimings`, `runAfterAnimation`
- All `render*` screen functions
- Sailing **DOM** wiring: `applyRectLayout`, `applyCircleLayout`, guides, picker
  HUD, `sailShipTo`, `renderSailing`
- Map fly sprite playback (`preloadMapFlyFrames`, `playMapFlyFrames`)
- `buildPlaytestSummary`

**Consolidate:**

- Merge `appendCircleImage` into `appendVisual` (one img+placeholder helper)

**Keep in renderer** (tightly coupled to sailing DOM / CONFIG dev tools):

- `getSailingLayout`, `shouldShowSailingGuides`, `isSailingLayoutPickerActive`
- `attachSailingLayoutPicker`, `updateSailingLayoutPickerHud`

Optional later: move config-flag helpers to a tiny `js/devTools.js` — out of
scope for this branch unless time allows.

## Script load order (`index.html`)

```html
<script src="config/config.js"></script>
<script src="config/assets.js"></script>
<script src="js/utils.js"></script>
<script src="js/layoutGeometry.js"></script>   <!-- NEW: after utils -->
<script src="js/gameLogic.js"></script>       <!-- NEW: after utils -->
<script src="js/renderer.js"></script>
<script src="js/gameState.js"></script>
<script src="js/main.js"></script>
```

`gameLogic.js` depends on `utils.js` (`shuffle`, `clamp`, …).  
`renderer.js` depends on `layoutGeometry.js` and `utils.js` (`buildShuffledOptions`).  
`gameState.js` depends on `gameLogic.js` and `renderer.js`.

## Branch workflow

```bash
git checkout main
git pull                    # optional: sync before branching
git checkout -b refactor/module-boundaries
```

Merge only after the full test checklist below passes on the branch.

Suggested commit sequence (Conventional Commits):

1. `docs: add module-boundaries refactor plan`
2. `refactor(utils): keep only generic helpers in utils.js`
3. `feat(gameLogic): extract map and question route builders`
4. `feat(layoutGeometry): extract percent layout math from renderer`
5. `refactor(renderer): drop dead circle helpers and merge appendCircleImage`
6. `docs: record module split in changelog and README`

## Implementation phases

### Phase 0 — Baseline capture (before any code moves)

On **current `main`** (or the commit you branch from):

1. Set `CONFIG.DEBUG_MODE: false`, `SAILING_LAYOUT_PICKER: false`,
   `SAILING_SHOW_LAYOUT_GUIDES: false`.
2. Open `index.html` at a fixed browser width (e.g. 1280×720 or full screen).
3. Screenshot or note these screens:
   - Start screen
   - Map screen (with assets visible)
   - Map fly-away (mid-sequence frame)
   - Sailing screen (ship + island positions)
   - Island question screen
   - Lose screen
   - Win screen
4. Play one full **win** run and one **lose** run on difficulty `בינוני`.
5. Record in a scratch note:
   - Number of map assets shown
   - Question count
   - That wrong answer shows correct answer (if `SHOW_CORRECT_ANSWER_ON_LOSS`)
6. Open DevTools → Console: confirm **no errors** on start and through one run.

This baseline is the visual + logic reference for the branch.

### Phase 1 — Add `gameLogic.js`

- Cut question/route functions from `utils.js` into `gameLogic.js`.
- Leave re-exports or simply rely on globals (same pattern as today).
- Update `index.html` script tag.
- **Smoke test:** start game, map appears, questions load.

### Phase 2 — Add `layoutGeometry.js`

- Move pure geometry functions from `renderer.js`.
- Update `renderer.js` call sites (same function names, new file).
- Remove dead `isInsideCircle` / `clampPointToCircle`.
- **Smoke test:** sailing screen — sea click moves ship; island click advances.

### Phase 3 — Renderer cleanup

- Merge `appendCircleImage` → `appendVisual`.
- Trim comments/file headers to match new roles.
- Update `README.md` file structure section.

### Phase 4 — Docs

- `docs/changelog.md`, `docs/decisions.md`, `docs/progress.md`
- `docs/playtest.md`: add one line pointing to this plan’s checklist

## Testing strategy

No automated test runner in the project. Use **manual regression** plus light
**console smoke checks**. Run all tests on the **branch** after each phase and
again before merge.

### A. Console smoke checks (fast, after every phase)

Open `index.html` with DevTools → Console.

| Step | Action | Pass if |
| --- | --- | --- |
| 1 | Reload page | No red errors on load |
| 2 | `typeof shuffle` | `"function"` |
| 3 | `typeof selectRandomMapAssets` | `"function"` (after Phase 1) |
| 4 | `typeof getRectBounds` | `"function"` (after Phase 2) |
| 5 | `typeof renderStartScreen` | `"function"` |
| 6 | Start a game | No errors through map → sailing → Q1 |

Optional one-liner after Phase 2 (paste in console on sailing screen):

```js
getRectBounds({ x: 50, y: 68, widthPercent: 92, heightPercent: 55 })
// expect { left: 4, right: 96, top: 40.5, bottom: 95.5 }
```

### B. Logic regression (full run)

Use `DEBUG_MODE: false` unless the row says otherwise.

| # | Test | Steps | Pass if |
| --- | --- | --- | --- |
| L1 | Start | Open page | Start screen, Hebrew RTL, hook cursor |
| L2 | Difficulty | Pick each level once | Each starts a game with expected asset/question counts per `DIFFICULTY_LEVELS` |
| L3 | Map timer | Watch map | Timer bar drains; map closes after `MAP_VIEW_TIME_MS` |
| L4 | Map assets | Start `בינוני` twice | Asset count matches level; positions use `MAP_ASSET_LAYOUT`; route differs between runs |
| L5 | Map fly-away | Let map expire | Sprite fly frames play; no stuck screen |
| L6 | Sailing sea | Click inside sea | Ship moves to click (clamped to sea rect) |
| L7 | Sailing island | Click island | Ship sails to dock; next question opens |
| L8 | Sailing block | Click sky/beach outside sea | No ship move (`not-allowed` cursor) |
| L9 | Correct answer | Answer correctly | Advances; sailing → next island |
| L10 | Wrong answer | Answer wrongly | Lose screen; progress text; menu button works |
| L11 | Win | Clear all questions | Win screen; playtest summary; restart works |
| L12 | Restart | Win/lose → menu → play again | New randomized map and questions |
| L13 | Answer shuffle | Same question twice (DEBUG skip) | Option **order** may change; correct index still works via `originalIndex` |
| L14 | DEBUG_MODE | `DEBUG_MODE: true` | Correct answer marked; skip advances; playtest extra line on end screens |

### C. Visual regression (compare to Phase 0 baseline)

Same browser size as baseline. Side-by-side or overlay screenshots.

| # | Screen | Check |
| --- | --- | --- |
| V1 | Start | Background, title, difficulty buttons unchanged |
| V2 | Map header | `🗺️ - מפת האוצר - זכרו את הרמזים!` position, bold black |
| V3 | Map assets | Clues same relative positions on map card |
| V4 | Sailing layout | Ship, island, sea hit area align with background art |
| V5 | Sailing cursors | Hook on sea/island; `not-allowed` on sky/land |
| V6 | Island UI | Character, question, four answer buttons, progress line |
| V7 | Lose / win | Backgrounds, buttons, Hebrew text, playtest box |

### D. Dev-tool paths (layout picker)

With `SAILING_LAYOUT_PICKER: true`, `SAILING_SHOW_LAYOUT_GUIDES: true`:

| # | Test | Pass if |
| --- | --- | --- |
| D1 | Picker HUD | English HUD visible; crosshair on scene |
| D2 | Click | Console logs `[SAILING_LAYOUT]` point snippets |
| D3 | Shift+click ×2 | Console logs full `sea: { … }` block |
| D4 | No gameplay | Ship does not move; island does not advance |

Turn picker off before final sign-off.

### E. `file://` and static host

| # | Test | Pass if |
| --- | --- | --- |
| E1 | `file://` | Open `index.html` directly — full run works |
| E2 | Local static server (optional) | Same behavior if you use `python -m http.server` |

### F. Regression failure protocol

1. Note which checklist ID failed (e.g. `L6`, `V4`).
2. `git bisect` or revert the last commit on the branch.
3. Fix before continuing; do not stack moves on a broken phase.

## Merge criteria

All must be true:

- [ ] Phases 1–4 complete
- [ ] Section A: no console errors
- [ ] Section B: L1–L14 pass
- [ ] Section C: V1–V7 match baseline (acceptable: sub-pixel anti-alias only)
- [ ] Section D: D1–D4 pass (picker still works)
- [ ] Section E: E1 pass
- [ ] `DEBUG_MODE: false` in committed `config.js` for presentation default
- [ ] README file structure updated
- [ ] Docs updated (`changelog`, `decisions`, `progress`)

Then open a PR from `refactor/module-boundaries` → `main` (do not push straight
to `main` without review if your course requires it).

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Wrong script order → `ReferenceError` | Follow load order above; run smoke checks after each commit |
| Missed global after move | Grep for function names across `js/` before deleting |
| Visual drift from accidental CSS/JS change | Phase 0 screenshots; scope commits to `.js` + `index.html` only |
| Dead code removal breaks future feature | Only remove functions confirmed unused by repo-wide grep |

## File header templates (after refactor)

```js
// utils.js — Generic helpers. No DOM, no game flow, no asset-specific content.

// gameLogic.js — Builds randomized map assets and question routes from catalog data.

// layoutGeometry.js — Percent-based rect/circle math for layout and hit testing.

// renderer.js — DOM rendering only. No game state transitions.
```

## Estimated effort

| Phase | Time |
| --- | --- |
| 0 Baseline | 15–20 min |
| 1 gameLogic.js | 30–45 min |
| 2 layoutGeometry.js | 30–45 min |
| 3 Renderer cleanup | 20–30 min |
| 4 Docs + full test pass | 30–45 min |
| **Total** | ~2–3 hours |
