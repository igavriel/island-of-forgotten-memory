# Progress

## Current status

Playable prototype. The full game loop was verified end to end (start to win/lose) with emoji/text placeholders. No code fixes were required.

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

## Partially working

- CSS animations are basic and could be polished.

## Not implemented yet

- Real images (using emoji/text placeholders for now).
- Sound effects.

## Known limitations

- Map cannot be reopened once hidden (by design).
- A single wrong answer ends the game (by design).
- Content is a small Hebrew riddle pool.

## Current prototype goal

Done: the full game loop is solid with placeholders. Next focus is polishing CSS animations and preparing optional image fields, keeping the project fully static.
