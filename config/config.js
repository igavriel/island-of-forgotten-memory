// config.js
// Central game settings.

const CONFIG = {
    // How long the treasure map is visible.
    MAP_VIEW_TIME_MS: 10000,

    // Animation timings in milliseconds.
    SAILING_SHIP_TRAVEL_MS: 1200,
    ANSWER_FEEDBACK_MS: 420,

    // Screen and transition images.
    START_SCREEN_IMAGE: "assets/ui/start_screen.jpeg",
    MAP_BACKGROUND_IMAGE: "assets/map/treasure_map.png",
    MAP_FLY_FRAMES: [
        "assets/map/treasure_map_fly_01.png",
        "assets/map/treasure_map_fly_02.png",
        "assets/map/treasure_map_fly_03.png",
    ],
    MAP_FLY_FRAME_MS: 500,
    LOSE_SCREEN_IMAGE: "assets/endings/lose_ending_screen.png",
    VICTORY_IMAGE: "assets/endings/win_ending_screen.png",
    SAILING_BACKGROUND_IMAGE: "assets/ui/sailing_background.png",
    SAILING_SHIP_IMAGE: "assets/ui/sailing_ship.png",
    SAILING_DESTINATION_ISLAND_IMAGE: "assets/ui/destination_island.png",

    // Dashed guides for tuning sailing layout. Hidden during normal play.
    SAILING_SHOW_LAYOUT_GUIDES: false,

    // Layout picker: click sailing scene → log % to browser console. See docs/sailing-layout-krita.md.
    // While true, ship/island clicks on the sailing screen are disabled. Set false for play.
    SAILING_LAYOUT_PICKER: false,

    // Sailing screen layout — tune with SAILING_LAYOUT_PICKER or docs/sailing-layout-krita.md.
    // sea: center rect (widthPercent = scene width, heightPercent = scene height).
    // island / ship / dock: center + sizePercent (diameter as % of scene width).
    SAILING_LAYOUT: {
        sea: { x: 50, y: 80, widthPercent: 95, heightPercent: 40 },
        island: { x: 15, y: 65, sizePercent: 30 },
        ship: { x: 95, y: 80, sizePercent: 18 },
        dock: { x: 25, y: 80, sizePercent: 12 },
    },

    // Debug aids. Must be false for final presentation.
    DEBUG_MODE: false,

    // Show the correct answer after a wrong answer.
    SHOW_CORRECT_ANSWER_ON_LOSS: true,

    // Difficulty controls how many map images are shown and how many questions are asked.
    DEFAULT_DIFFICULTY: "medium",
    REQUIRED_MAP_CATEGORY: "volcano",
    DIFFICULTY_LEVELS: {
        easy: {
            label: "קל",
            assetCount: 3,
            questionCount: 5,
        },
        medium: {
            label: "בינוני",
            assetCount: 5,
            questionCount: 5,
        },
        hard: {
            label: "קשה",
            assetCount: 7,
            questionCount: 7,
        },
    },

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
