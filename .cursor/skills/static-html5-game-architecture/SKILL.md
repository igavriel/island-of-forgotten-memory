---
name: static-html5-game-architecture
description: Maintain a simple static HTML5 game architecture using vanilla JavaScript, CSS, and static assets. Use whenever modifying game structure, adding screens, changing game flow, adding assets, changing riddles, or refactoring.
---

# Static HTML5 Game Architecture

Help maintain a simple static HTML5 game architecture using vanilla JavaScript, CSS, and static assets.

## When to use

Use this skill whenever modifying game structure, adding screens, changing game flow, adding assets, changing riddles, or refactoring.

## Rules

1. Keep the site static.
2. Do not introduce npm, bundlers, frameworks, servers, or databases.
3. Use plain script tags and global modules/files.
4. Keep responsibilities separated:
   - `config/config.js`: game settings
   - `config/riddles.js`: content/data
   - `js/utils.js`: helper functions
   - `js/gameState.js`: game flow and state transitions
   - `js/renderer.js`: DOM rendering
   - `js/main.js`: startup/bootstrap
5. The game engine must not depend on specific riddle content.
6. The riddle pool must be separate from the selected route.
7. The selected route is generated at game start.
8. The map must render the selected route in order.
9. All UI text must remain Hebrew RTL.
10. Keep the code readable for a WEB course assignment.

## Preferred implementation style

- Use simple objects and functions.
- Avoid classes unless they clearly simplify the code.
- Avoid clever one-liners.
- Add comments where they explain game flow or non-obvious behavior.
- Prefer explicit names:
  - `selectedRiddles`
  - `currentIslandIndex`
  - `currentRiddle`
  - `correctIndex`
  - `originalIndex`

## Testing checklist after changes

- [ ] Can the game start?
- [ ] Does the map show the selected route?
- [ ] Does the map disappear after the configured time?
- [ ] Does the player move through islands?
- [ ] Does a correct answer advance?
- [ ] Does a wrong answer lose?
- [ ] Does the lose screen show progress?
- [ ] Does completing all islands win?
- [ ] Does restart reset state?
- [ ] Does DEBUG_MODE work?
