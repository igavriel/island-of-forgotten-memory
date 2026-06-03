// config.js
// Central game settings.

const CONFIG = {
    // Kept for compatibility until the old riddle route is removed.
    NUMBER_OF_ISLANDS: 5,

    // How long the treasure map is visible.
    MAP_VIEW_TIME_MS: 10000,

    // Animation timings in milliseconds.
    WIND_TRANSITION_MS: 1100,
    SAILING_TRANSITION_MS: 1800,
    ANSWER_FEEDBACK_MS: 420,

    // Optional map countdown text.
    SHOW_COUNTDOWN_NUMBER: false,

    // Show text labels for map hints when old hint rendering is used.
    SHOW_HINT_LABELS_ON_MAP: true,

    // Master image toggle.
    USE_IMAGE_ASSETS: true,

    // Screen and transition images.
    USE_SCREEN_PLACEHOLDER_IMAGES: true,
    START_SCREEN_IMAGE: "assets/ui/start_screen_placeholder.svg",
    MAP_BACKGROUND_IMAGE: "assets/map/map_01.png",
    VICTORY_IMAGE: "assets/endings/victory_placeholder.svg",
    SAILING_BACKGROUND_IMAGE: "assets/ui/sailing_background_placeholder.svg",
    SAILING_SHIP_IMAGE: "assets/ui/sailing_ship_placeholder.png",
    SAILING_DESTINATION_ISLAND_IMAGE:
        "assets/ui/destination_island_placeholder.png",

    // Debug aids. Must be false for final presentation.
    DEBUG_MODE: false,

    // Show the correct answer after a wrong answer.
    SHOW_CORRECT_ANSWER_ON_LOSS: true,

    // Random map asset placement. x/y/sizePercent are relative percentages.
    MAP_ASSET_LAYOUT: {
        volcano: {
            x: 50,
            y: 50,
            sizePercent: 24,
        },
        animal: {
            x: 24,
            y: 38,
            sizePercent: 13,
        },
        treasure: {
            x: 72,
            y: 68,
            sizePercent: 13,
        },
        statue: {
            x: 30,
            y: 70,
            sizePercent: 14,
        },
        tree: {
            x: 72,
            y: 32,
            sizePercent: 12,
        },
        flag: {
            x: 48,
            y: 24,
            sizePercent: 13,
        },
        food: {
            x: 52,
            y: 78,
            sizePercent: 10,
        },
    },
};
