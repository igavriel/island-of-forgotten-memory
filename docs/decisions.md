# Decisions

Locked-in design and technical decisions. Update when one changes.

- Static HTML site only (no backend).
- No npm and no build step.
- Vanilla JavaScript only (no framework).
- Hebrew, right-to-left (RTL) UI.
- Data-driven riddles.
- The riddle pool is separate from the selected route.
- The map shows the selected route in order.
- The map is shown for a configurable time.
- The map cannot be reopened after it is hidden.
- A wrong answer ends the game.
- The loss screen shows progress.
- Final images will be added later.
- The first prototype uses emoji/text placeholders.
- The loss screen reveals the player's wrong answer and the correct answer (learning feedback). This does not change the rules: a wrong answer still ends the game.
- Animations are CSS-only (no JS animation libraries) to keep the project simple and static.
- Configurable transition timings live in CONFIG (WIND_TRANSITION_MS, SAILING_TRANSITION_MS, ANSWER_FEEDBACK_MS) and are pushed into CSS custom properties (--wind-ms, --sail-ms, --answer-feedback-ms) at startup via applyAnimationTimings, so the JS flow timers and CSS animations share one source of truth. Cosmetic-only durations (fade, map reveal, island entrance) stay as CSS variables in :root. SAILING_TIME_MS was renamed to SAILING_TRANSITION_MS.
- The game supports prefers-reduced-motion: decorative animations are disabled while gameplay and flow are unchanged; the map timer bar keeps draining because it conveys remaining time. A wrong answer shows a final-feeling shake and a correct answer a positive pulse, but neither changes the rules (the answer feedback is a short visual moment before the existing transition).
- Riddles carry optional image fields (hintImage, islandBackgroundImage, characterImage, loseImage), default null. Images are used automatically wherever a path exists (presence-based), and always fall back to the emoji/text placeholder when the path is null or the file fails to load. CONFIG.USE_IMAGE_ASSETS (default true) is an optional master override: set it to false to force placeholder-only mode for testing. Asset naming/workflow is documented in docs/assets.md.
- Default island count is 5 (CONFIG.NUMBER_OF_ISLANDS), still configurable, drawn from a pool of at least 10 riddles.
- Playtesting is manual and documented in docs/playtest.md; no analytics and no stored data (no localStorage). The win/lose screens display the run's settings to support balancing.
- Image assets may be SVG (preferred for lightweight placeholders) or raster (PNG); both load as plain static files. Phase 7A added temporary SVG placeholders for the `gold` and `parrot` riddles only, to prove the pipeline. Images are now used automatically wherever a path exists: `gold` and `parrot` render their SVGs while every other riddle falls back to emoji/text (mixed mode by default).
