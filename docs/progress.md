# Progress

## Current status

Polished playable prototype. The full loop works end to end with emoji/text placeholders, and the UX/animation polish phase is done.

## What already works (verified)

- Start screen and screen switching.
- Randomized route selection of NUMBER_OF_ISLANDS riddles from the pool, fresh each game.
- Treasure map shows the selected route in order for MAP_VIEW_TIME_MS, then blows away; cannot be reopened.
- Sailing transition before every island.
- Per-island question with exactly 4 shuffled answers (original index preserved).
- Correct answers advance; wrong answers show the loss screen immediately with progress.
- Completing all islands shows the victory screen; "play again" starts a fresh randomized run.
- Debug mode (answer reveal + skip button + console reminder).
- Riddle pool validated: 10 riddles, each with exactly 4 options and a valid correctIndex.
- UX polish: start-screen panel, map reveal, wind blow-away with "הרוח העיפה את המפה!" message, ship sailing across waves, larger answer buttons with hover/pressed feedback, visible keyboard focus.
- Lose screen now shows the chosen wrong answer, the correct answer, and progress; win screen shows a final score.
- Basic responsive layout for desktop and small screens.

## Partially working

- Animations are intentionally simple (CSS-only); fine for the prototype.

## Not implemented yet

- Real images (using emoji/text placeholders for now).
- Sound effects.

## Known limitations

- Map cannot be reopened once hidden (by design).
- A single wrong answer ends the game (by design).
- Content is a small Hebrew riddle pool.

## Current prototype goal

Done: solid loop plus UX/animation polish, fully static. Next focus is preparing optional image fields in the riddle schema so real assets can drop in later.
