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
- Riddles carry optional image fields (hintImage, islandBackgroundImage, characterImage, loseImage), default null. Images are opt-in via CONFIG.USE_IMAGE_ASSETS (default false) and always fall back to the emoji/text placeholder if missing or off. Asset naming/workflow is documented in docs/assets.md.
- Default island count is 5 (CONFIG.NUMBER_OF_ISLANDS), still configurable, drawn from a pool of at least 10 riddles.
