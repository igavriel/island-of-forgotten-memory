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
2. Full art integration: replace the temporary SVG placeholders with real art. Per-riddle: add images for the remaining riddles under assets/ and set their paths (only `gold` and `parrot` have placeholders so far). Screen-level: replace the three 16:9 full-screen backgrounds (start_screen_placeholder.svg, treasure_map_placeholder.svg, victory_placeholder.svg) with final 16:9 art — paths/flags already wired via START_SCREEN_IMAGE / MAP_BACKGROUND_IMAGE / VICTORY_IMAGE, and no renderer/layout changes are needed. Keep the map background free of fixed clues (clues are dynamic). See docs/assets.md.
3. Optional: set SHOW_HINT_LABELS_ON_MAP false for image-only map clues once art is in.
4. Optional: balance the source correctIndex values (display is already shuffled, so this is cosmetic).
5. Optional: add sound effects.
