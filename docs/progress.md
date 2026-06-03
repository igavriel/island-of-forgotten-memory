# Progress

## Current status

Polished playable prototype. The full loop works end to end with emoji/text placeholders, and the UX/animation polish phase is done.

## What already works (verified)

- Start screen and screen switching.
- Randomized map asset selection: one image from each configured category, fresh each game.
- Asset-generated question route: one question per map category, currently 7 questions per run. Each category randomly uses `question1`/`answer1` or `question2`/`answer2`; answer options are unique values from the same category and answer field, with up to 4 options.
- Treasure map shows the selected randomized assets for MAP_VIEW_TIME_MS, then blows away; cannot be reopened.
- Fixed 16:9 responsive viewport: `#app` centers `#game-viewport` inside the browser window with letterboxing (`--letterbox-bg: #071827`) when the window is not 16:9. All backgrounds (`#screen-bg`) and UI render inside the viewport; backgrounds use `contain` (no stretch, no crop). Screens inject into `#screen`.
- Per-question flow with up to 4 shuffled unique answers (original index preserved).
- Correct answers advance; wrong answers show the loss screen immediately with progress.
- Completing all questions shows the victory screen; "play again" starts a fresh randomized run.
- Debug mode (answer reveal + skip button + console reminder).
- Riddle pool validated: 10 riddles, each with exactly 4 options and a valid correctIndex.
- UX polish: start-screen panel, map reveal, wind blow-away with "הרוח העיפה את המפה!" message, sailing transition with ship + destination island placeholders, larger answer buttons with hover/pressed feedback, visible keyboard focus.
- Animation/transition tuning (Phase 7B): configurable timings (WIND_TRANSITION_MS, SAILING_TRANSITION_MS, ANSWER_FEEDBACK_MS) synced into CSS variables at startup; pulsing "memorize" map cue; clearer "map cannot be reopened" wind message; island/character entrance; answer feedback flash (green pulse correct / red shake wrong) with a brief click lock; win celebration (trophy pop + confetti); optional numeric countdown (SHOW_COUNTDOWN_NUMBER); and prefers-reduced-motion support that keeps the game playable.
- Lose screen now shows the chosen wrong answer, the correct answer, progress ("הגעת לשאלה X מתוך Y"), and correct-question count; win screen shows a final score.
- Basic responsive layout for desktop and small screens.
- Image-ready: optional image fields on every riddle (default null), an appendVisual renderer fallback, USE_IMAGE_ASSETS flag, asset folders, and an asset integration guide. Placeholder mode is unchanged.
- Image pipeline proven (Phase 7A): two riddles (`gold`, `parrot`) ship simple SVG placeholders across hints/islands/characters/endings, wired into riddles.js. The other riddles keep null image fields and fall back to emoji/text (mixed mode). Images are now used automatically wherever a path exists (USE_IMAGE_ASSETS default true, an optional override to force placeholder-only mode); the game falls back to the hint emoji/label when there is no image or it fails to load. The per-riddle island background and lose images are 16:9 and render as full-screen backgrounds (via the shared #screen-bg layer); hint and character images remain inline.
- Screen-level placeholder art: four 16:9 full-screen SVG backgrounds inside `#game-viewport` on `#screen-bg` (`background-size: contain`). Letterboxing outside the viewport when the browser window is not 16:9.
- Custom pirate hook mouse cursor: `assets/ui/pirate_hook_cursor.svg`, applied site-wide via CSS (`cursor: url(...) 6 6, pointer` with fallback). CSS-only; no JavaScript.
- Playtest/balancing: win and lose screens show a summary (islands completed + map time always; hint-labels and debug-mode lines in DEBUG_MODE only); SHOW_CORRECT_ANSWER_ON_LOSS flag; manual playtest log in docs/playtest.md. No stored data.
- Dynamic map asset layer: `config/assets.js` provides categorized image pools, `CONFIG.MAP_ASSET_LAYOUT` controls relative `x`, `y`, and `sizePercent`, and each new run randomly selects one image per configured category. The map image is now the actual full-screen stage: assets render directly on it, the header sits at the top, and the timer bar sits at the bottom.
- Asset question convention: each asset category now has configurable `question1` and `question2`; each image asset now has `answer1` and placeholder numeric `answer2` instead of `name`.

## Partially working

- Animations are intentionally simple (CSS-only) and now tuned (Phase 7B), with reduced-motion support; fine for the prototype.

## Not implemented yet

- Old static `RIDDLES` route logic cleanup/removal after the generated asset-question flow is stable.
- Final/real artwork (only 2 riddles have temporary SVG placeholders so far; the data model, renderer, and pipeline are proven and ready for the full art set).
- Sound effects.

## Known limitations

- Map cannot be reopened once hidden (by design).
- A single wrong answer ends the game (by design).
- Old static riddle data still exists for now, but the active route is generated from map assets.

## Current prototype goal

Done: solid loop, UX/animation polish, image-asset readiness, and generated map-based 7-question runs, all fully static. Next focus is cleaning up the old static riddle route and integrating final image/question content.
