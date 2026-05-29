# Changelog

## 2026-05-29

- Fixed the wind blow-away map animation being cut short. The map timer bar's `drain` animation ends at the same moment the blow-away starts, and its `animationend` event bubbled up to `.map-card`, prematurely firing the post-animation callback. `runAfterAnimation` now ignores `animationend` events bubbling from child elements (checks `event.target === element`).

- Playtest/balancing pass: win and lose screens show a summary (islands completed and map view time always; hint-labels and debug-mode lines only in DEBUG_MODE). Added SHOW_CORRECT_ANSWER_ON_LOSS config flag and a manual playtest log + balancing guide in docs/playtest.md. No analytics or stored data.
- Expanded the default prototype from 3 to 5 islands (NUMBER_OF_ISLANDS=5) using the existing 10-riddle pool. Added a "זכרת נכון N רמזים" remembered-clues line (guarded with Math.max(0, ...)) to the lose screen. Verified random no-duplicate 5-island route, win/lose flow, and restart randomization.
- Image-asset preparation: optional image fields on every riddle (default null), an appendVisual renderer fallback (with alt text), USE_IMAGE_ASSETS config flag, assets/ subfolders, minimal image CSS classes, and a new docs/assets.md guide. Placeholder mode unchanged.
- UX/animation polish: start-screen panel, refined map reveal, wind blow-away message, ship sailing animation, larger answer buttons with hover/pressed feedback, visible focus styles, responsive tweaks. Lose screen now reveals chosen + correct answer; win screen shows a final score.
- Verified the full playable game loop end to end (15-point checklist); no code fixes needed. Validated riddle pool (10 riddles, 4 options each). Updated docs.
- Added docs progress system.
