# Next steps

Prioritized. Check before changing code; update when priorities change.

Done so far: full loop verified; UX and CSS animation polish; image-asset preparation
(renderer fallback, asset folders, docs/assets.md);
expanded to a 5-island default (pool of 10) with verified route/win/lose/restart;
added playtest/balancing support (end-screen settings summary + docs/playtest.md);
proved the image pipeline with static image placeholders;
tuned animations/transitions (Phase 7B): configurable timings, answer feedback, island entrance,
win celebration, and prefers-reduced-motion support; added randomized map assets with configurable
relative placement; generated difficulty-based map questions from selected assets.

## Priority 1: content QA

Goal: make every generated question clear, fair, and grammatically correct.

- Review all Hebrew question text in `config/assets.js`.
- Fix animal question wording, for example `לאיזה משפחת החיות` should be cleaned up.
- Verify every category's `question2` matches every asset's `answer2`.
- Check ambiguous values:
  - food `answer2` groups
  - treasure `answer2` labels
  - volcano `answer2` yes/no logic
  - flag color names
- Remove stale documentation wording that still describes `answer2` as a placeholder numeric value.

## Priority 2: playtest and balance

Goal: decide whether the current timing and difficulty levels feel right.

- Run at least one complete playtest for each difficulty: `קל`, `בינוני`, `קשה`.
- Record results in `docs/playtest.md`.
- Check whether 10 seconds is enough for the map.
- Check whether `קל` is fair with 3 pictures and 5 questions.
- Check whether `קשה` is too crowded with 7 pictures.
- Tune if needed:
  - `CONFIG.MAP_VIEW_TIME_MS`
  - `CONFIG.DIFFICULTY_LEVELS`
  - `CONFIG.MAP_ASSET_LAYOUT` positions
  - asset `sizePercent` values

## Priority 3: final art integration

Goal: replace or approve placeholder-style assets before final presentation.

- Review start screen art.
- Review sailing background, ship, and destination island art.
- Review victory screen art.
- Review map image and whether category assets are readable on it.
- Replace temporary/static placeholders with final art where needed. See `docs/assets.md`.

## Priority 4: optional polish

Goal: add only if the game is already content-complete and balanced.

- Optional: add sound effects for start, map wind, sailing, correct answer, wrong answer, and victory.
- Keep sound static-file only; no libraries or build step.
