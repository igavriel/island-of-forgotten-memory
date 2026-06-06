# Pirate Memory Game Rules

This project is a static HTML5 Hebrew RTL point-and-click memory game.

## Codex Agent Source of Truth
- Treat this file as the project-level Codex agent instructions.
- These instructions intentionally mirror and extend the Cursor rules in `.cursor/rules/`.
- When instructions appear in both places, preserve the stricter project constraint.
- Before meaningful implementation work, check the relevant Cursor rule file:
  - `.cursor/rules/project-constraints.mdc` for static-site constraints and file layout
  - `.cursor/rules/gameplay-flow.mdc` for state transitions, debug mode, and animations
  - `.cursor/rules/rendering-i18n.mdc` for Hebrew RTL rendering and answer shuffling
  - `.cursor/rules/game-data.mdc` for legacy context; active data now lives in `config/assets.js`
  - `.cursor/rules/workflow-and-docs.mdc` for docs and incremental workflow
  - `.cursor/rules/conventional-commits.mdc` for commit-message format

## Codex Skill Usage
- Use `.cursor/skills/static-html5-game-architecture/SKILL.md` when modifying game structure, screens, flow, assets, questions, or refactoring.
- Use `.cursor/skills/pirate-memory-riddle-content/SKILL.md` only when explicitly working with legacy Cursor content guidance; active questions are generated from assets.
- Cursor skills are project guidance, not runtime dependencies. Do not add code that loads or depends on `.cursor`.
- If a task touches both architecture and question content, apply the architecture skill first.

## Hard Constraints
- Static site only.
- No backend, server, database, npm, build step, bundler, or framework.
- No React, Vue, Angular, Vite, Next.js, TypeScript, or JS animation libraries.
- Use only HTML, CSS, vanilla JavaScript, and static assets.
- Must run by opening index.html directly in the browser.
- Must also work on GitHub Pages.
- Do not use fetch() for local JSON in the first version.

## Architecture
Use simple modular files:
- config/config.js for settings
- config/assets.js for categorized assets and generated question data
- js/utils.js for generic helpers
- js/layoutGeometry.js for percent layout math
- js/gameLogic.js for map/question route generation
- js/renderer.js for DOM rendering
- js/gameState.js for game flow
- js/main.js for startup

Keep code readable, explicit, and suitable for a WEB course assignment.

Prefer simple objects and functions with clear names such as `selectedQuestions`,
`selectedMapAssets`, `currentQuestionIndex`, `correctIndex`, and `originalIndex`.
Avoid clever one-liners and unnecessary classes.

## Gameplay
- Player sees a treasure map for configurable time.
- Map is then removed by wind and cannot be reopened.
- Player advances through generated map questions.
- Each question has up to 4 answer options.
- Correct answer advances.
- Wrong answer shows loss screen and progress.
- Completing all islands shows victory.
- Restart starts a new randomized run.

## Answer Shuffling
- Answer buttons may be shuffled for display.
- If shuffled, preserve each option's original index.
- Pass the original index to game state on click.
- Never compare the shuffled display index directly to `correctIndex`.

## Data
- `config/assets.js` is the active data source.
- Difficulty controls how many random map assets are selected and how many generated questions are asked.
- A selected map asset may create both `question1` and `question2` when the difficulty asks for more questions than displayed images.
- Each category should define `question1`, `question2`, `islandEmoji`, `islandTitle`, `characterEmoji`, `characterName`, `failTitle`, and `assets`.
- Each asset should define `category`, `path`, `answer1`, and `answer2`.
- The game engine must not hardcode specific asset content.

## Hebrew and RTL
- All user-facing text must be Hebrew.
- HTML must use lang="he" and dir="rtl".
- CSS must support RTL layout.
- Map assets are visual clues and are positioned with `CONFIG.MAP_ASSET_LAYOUT`.

## Debug
- CONFIG.DEBUG_MODE should exist.
- Debug mode may show correct answers and developer skip/correct button.
- Document that DEBUG_MODE should be false for final presentation.

## Animations
Use simple CSS animations:
- map reveal
- wind blows map away
- sailing transition
- answer hover
- answer click

Do not over-engineer animations.

## Workflow
- Work in small, scoped steps and preserve existing behavior unless asked to change it.
- Do not rewrite the whole project unless explicitly requested.
- Maintain `docs/progress.md`, `docs/decisions.md`, `docs/next-steps.md`, and `docs/changelog.md` as part of every meaningful implementation step.
- README.md should explain the goal, run instructions, file structure, game flow, config options, and asset-question data.
- Commit messages, when requested, must follow Conventional Commits:
  `<type>(<optional scope>): <short summary>`.
