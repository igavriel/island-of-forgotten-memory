// config.js
// All game settings live here only. Change these values to tune the game.
// This file does not depend on the riddle content or the game engine.

const CONFIG = {
  // How many islands (riddles) are selected from the riddle pool each game.
  NUMBER_OF_ISLANDS: 5,

  // How long the treasure map is shown to the player, in milliseconds (10 seconds).
  MAP_VIEW_TIME_MS: 10000,

  // ---- Transition/animation timings (ms) ----
  // Keep these short so repeated gameplay stays snappy. The matching CSS animations
  // read these values at startup (see applyAnimationTimings in renderer.js), so JS
  // flow and CSS visuals stay in sync. Adjust here to tune the feel in one place.
  //
  // How long the "wind blows the map away" transition lasts (the strongest transition).
  WIND_TRANSITION_MS: 1100,
  // Duration of the sailing animation between islands.
  SAILING_TRANSITION_MS: 1600,
  // Short pressed/feedback moment after clicking an answer, before the screen changes.
  ANSWER_FEEDBACK_MS: 420,

  // Optional: show a numeric seconds countdown on the map timer bar. Default false keeps
  // the calmer visual bar only; true adds a small "נותרו N שניות" line for clarity.
  SHOW_COUNTDOWN_NUMBER: false,

  // Prototype: true to show both the emoji and a text label on the map.
  // Final version: false to show a visual clue only.
  SHOW_HINT_LABELS_ON_MAP: true,

  // Images are used automatically wherever a riddle provides a path; any riddle without
  // a path (or whose file fails to load) falls back to the emoji/text placeholder.
  // This master switch is an optional override: set it to false to force placeholder-only
  // mode (ignore all image paths), e.g. for testing. Currently only the "gold" and
  // "parrot" riddles ship SVG placeholders; the rest fall back to emoji/text.
  USE_IMAGE_ASSETS: true,

  // ---- Screen-level decorative placeholder images ----
  // Optional background/decoration images for whole screens (separate from per-riddle
  // images above). Gated by USE_SCREEN_PLACEHOLDER_IMAGES; if an image is missing or fails
  // to load, the screen keeps its normal emoji/text layout. The dynamic map route clues are
  // always rendered on top of the map background from selectedRiddles.
  USE_SCREEN_PLACEHOLDER_IMAGES: true,
  START_SCREEN_IMAGE: "assets/ui/start_screen_placeholder.svg",
  MAP_BACKGROUND_IMAGE: "assets/map/treasure_map_placeholder.svg",
  VICTORY_IMAGE: "assets/endings/victory_placeholder.svg",

  // Debug mode. Must be false for the final presentation.
  // When true: the correct answer is shown and a developer skip/answer button appears.
  DEBUG_MODE: false,

  // Playtest/balancing: true shows the correct answer on the lose screen (helps learning).
  // Set false for a harder, no-hint loss screen.
  SHOW_CORRECT_ANSWER_ON_LOSS: true,
};
