# Pirate Memory Game Rules

This project is a static HTML5 Hebrew RTL point-and-click memory game.

## Hard Constraints
- Static site only.
- No backend, server, database, npm, build step, bundler, or framework.
- Use only HTML, CSS, vanilla JavaScript, and static assets.
- Must run by opening index.html directly in the browser.
- Must also work on GitHub Pages.
- Do not use fetch() for local JSON in the first version.

## Architecture
Use simple modular files:
- config.js for settings
- riddles.js for riddle data
- utils.js for helpers
- renderer.js for DOM rendering
- gameState.js for game flow
- main.js for startup

Keep code readable, explicit, and suitable for a WEB course assignment.

## Gameplay
- Player sees a treasure map for configurable time.
- Map is then removed by wind and cannot be reopened.
- Player sails between randomized islands.
- Each island asks a 4-answer question.
- Correct answer advances.
- Wrong answer shows loss screen and progress.
- Completing all islands shows victory.
- Restart starts a new randomized run.

## Data
- RIDDLES is a pool, not a fixed route.
- CONFIG.NUMBER_OF_ISLANDS controls selected riddles per run.
- The map must display the selected riddles in route order.
- The game engine must not hardcode specific riddle content.

## Riddle Format
Each riddle should include:
- id
- hintEmoji
- hintLabel
- question
- options
- correctIndex
- islandTitle
- characterName
- failTitle
- failText

Future image fields:
- hintImage
- islandBackgroundImage
- characterImage
- loseImage

## Hebrew and RTL
- All user-facing text must be Hebrew.
- HTML must use lang="he" and dir="rtl".
- CSS must support RTL layout.

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
