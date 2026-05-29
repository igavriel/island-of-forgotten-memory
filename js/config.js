// config.js
// All game settings live here only. Change these values to tune the game.
// This file does not depend on the riddle content or the game engine.

const CONFIG = {
  // How many islands (riddles) are selected from the riddle pool each game.
  NUMBER_OF_ISLANDS: 5,

  // How long the treasure map is shown to the player, in milliseconds (10 seconds).
  MAP_VIEW_TIME_MS: 10000,

  // Duration of the sailing animation between islands, in milliseconds.
  SAILING_TIME_MS: 1800,

  // Prototype: true to show both the emoji and a text label on the map.
  // Final version: false to show a visual clue only.
  SHOW_HINT_LABELS_ON_MAP: true,

  // false keeps the emoji/text prototype. true uses image assets where a riddle
  // provides a path (with automatic fallback to the emoji/text placeholder).
  USE_IMAGE_ASSETS: false,

  // Debug mode. Must be false for the final presentation.
  // When true: the correct answer is shown and a developer skip/answer button appears.
  DEBUG_MODE: false,
};
