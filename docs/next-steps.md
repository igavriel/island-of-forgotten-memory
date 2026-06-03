# Next steps

Prioritized. Check before changing code; update when priorities change.

Done so far: full loop verified; UX and CSS animation polish; image-asset preparation
(renderer fallback, USE_IMAGE_ASSETS flag, asset folders, docs/assets.md);
expanded to a 5-island default (pool of 10) with verified route/win/lose/restart;
added playtest/balancing support (end-screen settings summary + docs/playtest.md);
proved the image pipeline with static image placeholders;
tuned animations/transitions (Phase 7B): configurable timings, answer feedback, island entrance,
win celebration, and prefers-reduced-motion support; added randomized map assets with configurable
relative placement; generated one map-based question per selected category.

1. Run playtests and record results in docs/playtest.md; pick the best island count + map time (and now also the transition timings).
2. Full art integration: replace temporary/static placeholders with final map, character/category, sailing, and ending art. See docs/assets.md.
3. Balance category `question1` / `question2` and `answer1` / `answer2` values.
4. Optional: add sound effects.
