# Decisions

Locked-in design and technical decisions. Update when one changes.

- Static HTML site only (no backend).
- No npm and no build step.
- Vanilla JavaScript only (no framework).
- Hebrew, right-to-left (RTL) UI.
- Data-driven questions.
- The active question route is generated from the randomized map assets.
- The map shows the randomized assets; questions are all related to the map, not to specific islands.
- The map is shown for a configurable time.
- The map cannot be reopened after it is hidden.
- A wrong answer ends the game.
- The loss screen shows progress.
- Final images will be added later.
- The first prototype uses emoji/text placeholders.
- The loss screen reveals the player's wrong answer and the correct answer (learning feedback). This does not change the rules: a wrong answer still ends the game.
- Animations are CSS-only (no JS animation libraries) to keep the project simple and static.
- Configurable transition timings live in CONFIG (WIND_TRANSITION_MS, SAILING_TRANSITION_MS, ANSWER_FEEDBACK_MS) and are pushed into CSS custom properties (--wind-ms, --sail-ms, --answer-feedback-ms) at startup via applyAnimationTimings, so the JS flow timers and CSS animations share one source of truth. Cosmetic-only durations (fade, map reveal, island entrance) stay as CSS variables in :root. SAILING_TIME_MS was renamed to SAILING_TRANSITION_MS.
- All screen-level 16:9 backgrounds render on `#screen-bg` inside `#game-viewport` with `background-size: contain`. The game uses a letterboxed 16:9 viewport (`#app` / `#game-viewport`); non-16:9 browser windows show `--letterbox-bg` outside the scene. UI injects into `#screen`.
- The sailing transition uses right-to-left ship movement (RTL feel: ship enters from the right, destination island on the left, ship stops near the island). Positions use % of `#game-viewport`, not `vw`. Vertical bobbing is approximated with stepped CSS keyframes. Full-screen sailing background: `assets/ui/sailing_background_placeholder.svg` (CONFIG.SAILING_BACKGROUND_IMAGE). Foreground sprites: `assets/ui/sailing_ship_placeholder.svg` and `assets/ui/destination_island_placeholder.svg`, with emoji fallbacks. Sailing text is plain over the sky (text-shadow), not a panel.
- The game supports prefers-reduced-motion: decorative animations are disabled while gameplay and flow are unchanged; the map timer bar keeps draining because it conveys remaining time. A wrong answer shows a final-feeling shake and a correct answer a positive pulse, but neither changes the rules (the answer feedback is a short visual moment before the existing transition).
- Generated asset questions use category metadata and selected map assets. `CONFIG.USE_IMAGE_ASSETS` controls whether configured images render.
- The active run uses the selected difficulty to decide how many map assets and generated questions to include.
- Playtesting is manual and documented in docs/playtest.md; no analytics and no stored data (no localStorage). The win/lose screens display the run's settings to support balancing.
- Image assets may be SVG or raster (PNG/JPG); both load as plain static files.
- The visual map renders randomized assets chosen for the selected difficulty. Asset pools live in `config/assets.js`; map positions and display sizes live in `CONFIG.MAP_ASSET_LAYOUT` as relative `x`, `y`, and `sizePercent` values. The map image is rendered as an in-screen `<img>` so positioned assets share its coordinate space.
- Asset category question data lives in `ASSET_CATEGORIES`: each category has `question1`, `question2`, `islandEmoji`, `islandTitle`, `characterEmoji`, `characterName`, `failTitle`, and an `assets` array. Each asset stores `answer1` (the visual/name answer) and `answer2`, plus `category` and `path`.
- Generated question-screen emojis come directly from `ASSET_CATEGORIES.islandEmoji` and `characterEmoji`; title/name strings stay clean Hebrew text.
- Generated asset questions use the question shape expected by the renderer. Each category randomly chooses `question1`/`answer1` or `question2`/`answer2`; distractors are unique answers from the same category and answer field, with a maximum of 4 options.
- The welcome screen asks `איזו רמה לשחק?`. Difficulty is configured in `CONFIG.DIFFICULTY_LEVELS`: easy is 3 map images / 5 questions, medium is 5 / 5, and hard is 7 / 7. If a level asks for more questions than displayed images, selected images may contribute both question variants while still appearing only once on the map. Win/lose summaries show the selected difficulty.
- When a game ends (win or lose), the end-screen button returns to the main menu (`showStartScreen()`) instead of auto-restarting. The player chooses a difficulty again before the next run, so the button is labeled "לתפריט הראשי".
