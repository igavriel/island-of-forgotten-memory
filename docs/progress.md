# Progress

## Current status

Polished playable prototype. The full loop works end to end with emoji/text placeholders, and the UX/animation polish phase is done. Automated smoke tests live in `test.html` (`js/smokeTests.js`).

**Branch `refactor/dev-tools`:** Debug/layout picker moved to `devTools.js` + `devTools.css`. Builds on module-boundaries split (`utils`, `gameLogic`, `layoutGeometry`, `renderer`). Manual browser regression pending before merge.

## What already works (verified)

- Start screen and screen switching.
- Difficulty selection on the welcome screen: `קל`, `בינוני`, `קשה`.
- Randomized map asset selection by difficulty: 3, 5, or 7 images, fresh each game.
- Asset-generated question route by difficulty: 5, 5, or 7 questions per run. Each selected image can use `question1`/`answer1` and, when more questions are needed than images, `question2`/`answer2`; answer options are unique values from the same category and answer field, with up to 4 options.
- Treasure map shows the selected randomized assets for MAP_VIEW_TIME_MS, then plays a three-frame fly-away sprite (`MAP_FLY_FRAMES`); cannot be reopened.
- Fixed 16:9 responsive viewport: `#app` centers `#game-viewport` inside the browser window with letterboxing (`--letterbox-bg: #071827`) when the window is not 16:9. All backgrounds (`#screen-bg`) and UI render inside the viewport; backgrounds use `cover` with a very light scrim. Screens inject into `#screen`.
- Per-question flow with up to 4 shuffled unique answers (original index preserved), on the shared `sailing_background.png` full-screen background.
- Correct answers advance; wrong answers show the loss screen immediately with progress.
- Completing all questions shows the victory screen; the end-screen button ("לתפריט הראשי") returns to the main menu, where the player picks a difficulty to start a fresh randomized run.
- Debug mode (answer reveal + skip button + console reminder).
- Generated asset-question route validated for easy/medium/hard counts, unique generated question ids, and valid `correctIndex` values.
- UX polish: start-screen panel, map reveal, fly-away sprite sequence with "הרוח העיפה את המפה!" message, sailing transition with ship + destination island placeholders, larger answer buttons with hover/pressed feedback, visible keyboard focus.
- Interactive sailing: point-and-click sea movement (rectangular hit zone) and island dock to advance; `SAILING_LAYOUT` with optional hidden layout guides; `SAILING_SHIP_TRAVEL_MS` controls move speed.
- Animation/transition tuning (Phase 7B): configurable timings (MAP_FLY_FRAME_MS, SAILING_SHIP_TRAVEL_MS, ANSWER_FEEDBACK_MS); pulsing "memorize" map cue; clearer "map cannot be reopened" wind message; island/character entrance; answer feedback flash (green pulse correct / red shake wrong) with a brief click lock; win celebration (trophy pop + confetti); and prefers-reduced-motion support that keeps the game playable.
- Lose screen now shows the chosen wrong answer, the correct answer, progress ("הגעת לשאלה X מתוך Y"), and correct-question count, on a shared full-screen background (`assets/endings/ending_screen.png`); win screen shows a final score.
- Basic responsive layout for desktop and small screens.
- Image-ready: static asset folders, path-based image loading with emoji fallbacks, map asset layout, and an asset integration guide.
- Screen-level art: full-screen backgrounds inside `#game-viewport` on `#screen-bg` (`background-size: cover`, light scrim). Letterboxing outside the viewport when the browser window is not 16:9.
- Custom pirate hook mouse cursor: `assets/ui/hook-64x64.svg`, applied site-wide via CSS (`cursor: url(...) 6 6, pointer` with fallback). CSS-only; no JavaScript.
- Playtest/balancing: win and lose screens show a summary (islands completed + map time always; hint-labels and debug-mode lines in DEBUG_MODE only); lose screen always reveals the correct answer; manual playtest log in docs/playtest.md. No stored data.
- Dynamic map asset layer: `config/assets.js` provides categorized image pools, `CONFIG.MAP_ASSET_LAYOUT` controls relative `x`, `y`, and `sizePercent`, and each new run randomly selects images according to the selected difficulty. The map image is now the actual full-screen stage: assets render directly on it, the header sits at the top, and the timer bar sits at the bottom.
- Asset question convention: each asset category now has configurable `question1` and `question2`; each image asset now has `answer1` and placeholder numeric `answer2` instead of `name`.

## Partially working

- Animations are intentionally simple (CSS-only) and now tuned (Phase 7B), with reduced-motion support; fine for the prototype.

## Not implemented yet

- Content QA for final Hebrew question/answer wording.
- Playtest-based balancing for difficulty, map time, map positions, and image sizes.
- Final/real artwork approval or replacement for placeholder-style screens and transitions.
- Optional sound effects.

## Known limitations

- Map cannot be reopened once hidden (by design).
- A single wrong answer ends the game (by design).
- The active route is generated from map assets.

## Current prototype goal

Done: solid loop, UX/animation polish, image-asset readiness, difficulty-based generated map/question runs, and old static route removal. Next focus is content QA, playtest balancing, and final art readiness.
