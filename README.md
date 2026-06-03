# Island of the Lost Memory (אי הזיכרון האבוד) 🏴‍☠️

A static Hebrew RTL point-and-click memory game built with HTML, CSS, vanilla JavaScript, and static assets.

## How to run

No install, server, npm, or build step is required.

1. Open `index.html` directly in a browser.
2. Or host the folder on GitHub Pages / any static host.

The game works from `file://` because data lives in JavaScript files and no local `fetch()` is used.

## File structure

```text
index.html
config/
  config.js      # game settings
  assets.js      # categorized image assets and question data
css/style.css
js/utils.js      # shuffle, random selection, question generation
js/renderer.js   # DOM rendering
js/gameState.js  # game flow
js/main.js       # startup
docs/
assets/
```

## Game flow

1. Player starts a new run.
2. The game randomly selects one image from each configured asset category.
3. The selected images appear on the treasure map for `MAP_VIEW_TIME_MS`.
4. The map is blown away and cannot be reopened.
5. The game generates one question per selected category.
6. Each question randomly uses `question1`/`answer1` or `question2`/`answer2`.
7. Answer options are unique answers from the same category, up to 4 total.
8. A correct answer advances; a wrong answer shows the loss screen.
9. Completing all questions shows the victory screen.

## Configuration

Edit [config/config.js](config/config.js).

| Setting | Purpose |
| --- | --- |
| `MAP_VIEW_TIME_MS` | How long the map is visible |
| `WIND_TRANSITION_MS` | Wind animation duration |
| `SAILING_TRANSITION_MS` | Transition duration between questions |
| `ANSWER_FEEDBACK_MS` | Delay after answer click feedback |
| `SHOW_COUNTDOWN_NUMBER` | Optional numeric countdown on the map |
| `USE_IMAGE_ASSETS` | Enables image assets with fallbacks |
| `USE_SCREEN_PLACEHOLDER_IMAGES` | Enables screen/background images |
| `DEBUG_MODE` | Shows correct answers and a skip button; keep `false` for final presentation |
| `SHOW_CORRECT_ANSWER_ON_LOSS` | Shows the correct answer after a wrong answer |
| `MAP_ASSET_LAYOUT` | Relative `x`, `y`, and `sizePercent` map placement per category |

## Asset question data

Edit [config/assets.js](config/assets.js).

Each category in `ASSET_CATEGORIES` has:

```javascript
{
  question1: "איזה דגל הופיע במפה?",
  question2: "צבע הבד של הדגל?",
  islandEmoji: "🚩",
  islandTitle: "שאלת הדגלים",
  characterEmoji: "⚓",
  characterName: "קצין הדגלים",
  failTitle: "הדגל הונף לא נכון!",
  assets: FLAG_FILES,
}
```

Each asset has:

```javascript
{
  category: "flag",
  path: "assets/characters/flag_0005.png",
  answer1: "דגל עורב",
  answer2: "לבן",
}
```

The generated route uses the selected map asset as the correct answer and pulls distractors from unique answers in the same category.

## Notes

- All user-facing text must stay Hebrew.
- Layout is RTL via `<html lang="he" dir="rtl">`.
- The site must stay fully static.
- The old static route was removed; active questions are generated from `config/assets.js`.
