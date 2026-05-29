# Next steps

Prioritized. Check before changing code; update when priorities change.

Done so far: full loop verified; UX and CSS animation polish; image-asset preparation
(optional image fields, renderer fallback, USE_IMAGE_ASSETS flag, asset folders, docs/assets.md);
expanded to a 5-island default (pool of 10) with verified route/win/lose/restart;
added playtest/balancing support (end-screen settings summary + docs/playtest.md);
proved the image pipeline (Phase 7A) with SVG placeholders for the `gold` and `parrot` riddles;
tuned animations/transitions (Phase 7B): configurable timings, answer feedback, island entrance,
win celebration, and prefers-reduced-motion support.

1. Run playtests and record results in docs/playtest.md; pick the best island count + map time (and now also the transition timings).
2. Full art integration: replace the temporary SVG placeholders and add real images for the remaining riddles under assets/, set their paths, then turn on USE_IMAGE_ASSETS (see docs/assets.md). Currently only `gold` and `parrot` have placeholder SVGs.
3. Optional: set SHOW_HINT_LABELS_ON_MAP false for image-only map clues once art is in.
4. Optional: balance the source correctIndex values (display is already shuffled, so this is cosmetic).
5. Optional: add sound effects.
