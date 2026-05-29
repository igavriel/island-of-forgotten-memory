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
