# Playtest & Balancing

Manual playtesting for the no-image prototype. No analytics or stored data: record results
here by hand. The win/lose screens show the settings used in each run to make this easier.

## How to run a playtest

1. Set the difficulty knobs in [../js/config.js](../js/config.js) (see settings below).
2. Open [../index.html](../index.html) directly in a browser.
3. Play a full run (win or lose). The end screen always shows islands completed and map view
   time. Set `DEBUG_MODE: true` to also see whether hint labels were shown and whether debug
   mode was on. Set it back to `false` for normal play.
4. Record a row in the table below.

## Balancing settings (js/config.js)

| Setting | Effect |
| --- | --- |
| `NUMBER_OF_ISLANDS` | How many islands per run (default 5). |
| `MAP_VIEW_TIME_MS` | How long the map is shown, in ms (default 10000). |
| `SHOW_HINT_LABELS_ON_MAP` | `true` shows emoji + text label; `false` is a visual-only memory test. |
| `DEBUG_MODE` | `true` marks the correct answer and adds a skip button (testing only). |
| `SHOW_CORRECT_ANSWER_ON_LOSS` | `true` reveals the correct answer on the lose screen. |

## Recommended test settings

| Profile | Islands | Map time | Hint labels |
| --- | --- | --- | --- |
| Easy | 5 | 12 seconds | on |
| Normal | 5 | 10 seconds | on |
| Hard (visual-memory) | 5 | 10 seconds | off |
| Future full version | 8-10 | TBD after testing | TBD |

## Manual test log

| Tester | Islands | Map time | Hint labels | Result (win/lose) | Failed at | Difficulty (easy/fair/hard) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

## Questions to answer from testing

- Is 5 clues in 10 seconds fair, too easy, or too hard?
- Do players prefer labels on (easier) or off (pure visual memory)?
- What island count + map time feels best for the full version?
