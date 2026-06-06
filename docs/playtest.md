# Playtest & Balancing

Manual playtesting only. No analytics, storage, server, or database.

## How to run

1. Adjust settings in [config/config.js](../config/config.js).
2. Open [index.html](../index.html) directly in a browser.
3. Play a full run.
4. Record results manually below.

## Settings to test

| Setting | Effect |
| --- | --- |
| `MAP_VIEW_TIME_MS` | How long the map is visible |
| `SAILING_LAYOUT` | Sea rectangle plus island/ship/dock circles on the sailing screen |
| `SAILING_SHOW_LAYOUT_GUIDES` | Show dashed layout circles while tuning |
| `SAILING_SHIP_TRAVEL_MS` | Ship movement speed per click |
| `DEBUG_MODE` | Marks correct answers and adds a skip button |
| `DIFFICULTY_LEVELS` | Controls level labels and image/question counts |
| `MAP_ASSET_LAYOUT` | Changes asset positions and sizes on the map |

## Manual test log

| Tester | Map time | Result | Failed at question | Difficulty | Notes |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## Questions to answer

- Is 10 seconds enough to memorize the generated map assets?
- Does each difficulty feel different enough?
- Is `קל` fair with 3 pictures and 5 questions?
- Is `קשה` too crowded with 7 pictures?
- Are any category questions too easy or too ambiguous?
- Do the map positions and image sizes make each asset recognizable?
- Should any `MAP_ASSET_LAYOUT` position or `sizePercent` value change?
