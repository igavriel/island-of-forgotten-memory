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
- Lose screen now shows the chosen wrong answer, the correct answer, progress ("הגעת לאי X מתוך Y"), and remembered-clue count ("זכרת נכון N רמזים"); win screen shows a final score.
- Basic responsive layout for desktop and small screens.
- Image-ready: optional image fields on every riddle (default null), an appendVisual renderer fallback, USE_IMAGE_ASSETS flag, asset folders, and an asset integration guide. Placeholder mode is unchanged.

## Partially working

- Animations are intentionally simple (CSS-only); fine for the prototype.

## Not implemented yet

- Real image files (the data model and renderer are ready; placeholders still used by default).
- Sound effects.

## Known limitations

- Map cannot be reopened once hidden (by design).
- A single wrong answer ends the game (by design).
- Content is a small Hebrew riddle pool.

## Current prototype goal

Done: solid loop, UX/animation polish, image-asset readiness, and a 5-island default (verified), all fully static and placeholder-only. Next focus is integrating real images from Nitzan (set USE_IMAGE_ASSETS true and fill paths) per docs/assets.md.
