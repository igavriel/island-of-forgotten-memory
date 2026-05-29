# Progress

## Current status

Polished playable prototype. The full loop works end to end with emoji/text placeholders, and the UX/animation polish phase is done.

## What already works (verified)

- Start screen and screen switching.
- Randomized route selection of NUMBER_OF_ISLANDS riddles from the pool, fresh each game. Default is now 5 islands (pool of 10).
- Treasure map shows the selected route in order for MAP_VIEW_TIME_MS, then blows away; cannot be reopened.
- Sailing transition before every island.
- Per-island question with exactly 4 shuffled answers (original index preserved).
- Correct answers advance; wrong answers show the loss screen immediately with progress.
- Completing all islands shows the victory screen; "play again" starts a fresh randomized run.
- Debug mode (answer reveal + skip button + console reminder).
- Riddle pool validated: 10 riddles, each with exactly 4 options and a valid correctIndex.
- UX polish: start-screen panel, map reveal, wind blow-away with "הרוח העיפה את המפה!" message, ship sailing across waves, larger answer buttons with hover/pressed feedback, visible keyboard focus.
- Animation/transition tuning (Phase 7B): configurable timings (WIND_TRANSITION_MS, SAILING_TRANSITION_MS, ANSWER_FEEDBACK_MS) synced into CSS variables at startup; pulsing "memorize" map cue; clearer "map cannot be reopened" wind message; island/character entrance; answer feedback flash (green pulse correct / red shake wrong) with a brief click lock; win celebration (trophy pop + confetti); optional numeric countdown (SHOW_COUNTDOWN_NUMBER); and prefers-reduced-motion support that keeps the game playable.
- Lose screen now shows the chosen wrong answer, the correct answer, progress ("הגעת לאי X מתוך Y"), and remembered-clue count ("זכרת נכון N רמזים"); win screen shows a final score.
- Basic responsive layout for desktop and small screens.
- Image-ready: optional image fields on every riddle (default null), an appendVisual renderer fallback, USE_IMAGE_ASSETS flag, asset folders, and an asset integration guide. Placeholder mode is unchanged.
- Image pipeline proven (Phase 7A): two riddles (`gold`, `parrot`) ship simple SVG placeholders across hints/islands/characters/endings, wired into riddles.js. The other riddles keep null image fields and fall back to emoji/text (mixed mode). Images are now used automatically wherever a path exists (USE_IMAGE_ASSETS default true, an optional override to force placeholder-only mode); the game falls back to the hint emoji/label when there is no image or it fails to load. The per-riddle island background and lose images are 16:9 and render as full-screen backgrounds (via the shared #screen-bg layer); hint and character images remain inline.
- Screen-level placeholder art: three 16:9 full-screen SVG backgrounds (start sea scene, parchment treasure map with a dotted 5-stop route, win-screen treasure scene), rendered as a fixed full-screen layer behind the game (background-size: cover) and set per screen by setScreenBackground(). Configured via START_SCREEN_IMAGE / MAP_BACKGROUND_IMAGE / VICTORY_IMAGE and toggled by USE_SCREEN_PLACEHOLDER_IMAGES (default true). Decorative only with preload-based fallback to the sea gradient; text/buttons sit on translucent panels with a scrim; the dynamic route clues still render on top of the map background from selectedRiddles.
- Playtest/balancing: win and lose screens show a summary (islands completed + map time always; hint-labels and debug-mode lines in DEBUG_MODE only); SHOW_CORRECT_ANSWER_ON_LOSS flag; manual playtest log in docs/playtest.md. No stored data.

## Partially working

- Animations are intentionally simple (CSS-only) and now tuned (Phase 7B), with reduced-motion support; fine for the prototype.

## Not implemented yet

- Final/real artwork (only 2 riddles have temporary SVG placeholders so far; the data model, renderer, and pipeline are proven and ready for the full art set).
- Sound effects.

## Known limitations

- Map cannot be reopened once hidden (by design).
- A single wrong answer ends the game (by design).
- Content is a small Hebrew riddle pool.

## Current prototype goal

Done: solid loop, UX/animation polish, image-asset readiness, and a 5-island default (verified), all fully static and placeholder-only. Next focus is integrating real images from Nitzan (set USE_IMAGE_ASSETS true and fill paths) per docs/assets.md.
