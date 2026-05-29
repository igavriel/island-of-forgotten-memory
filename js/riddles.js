// riddles.js
// RIDDLES is a pool of possible riddles, not a fixed island sequence.
// The game randomly selects NUMBER_OF_ISLANDS riddles from the pool at the start of each game.
// Do not put game logic here. Do not assume a fixed island order.
//
// Structure of each riddle:
//   id                - unique identifier (string)
//   hintEmoji          - the emoji shown on the map as a visual clue
//   hintLabel          - text label for the clue (shown only if SHOW_HINT_LABELS_ON_MAP)
//   question           - the character's question on the island
//   options            - an array of exactly 4 answers
//   correctIndex       - the original index of the correct answer within options
//   islandTitle        - the island name
//   characterName      - the name of the asking character
//   failTitle          - the lose screen title
//   failText           - the lose screen text
//
// Future image fields (optional, to be added later):
//   hintImage, islandBackgroundImage, characterImage, loseImage

const RIDDLES = [
  {
    id: "gold",
    hintEmoji: "🪙",
    hintLabel: "מטבע זהב",
    question: "איזה אוצר נצנץ על מפת האי?",
    options: ["מטבע זהב", "פנינה כחולה", "יהלום ירוק", "כתר כסף"],
    correctIndex: 0,
    islandTitle: "אי הזהב",
    characterName: "רב החובל מורגן",
    failTitle: "האוצר אבד!",
    failText: "על המפה נצנץ מטבע זהב, לא תכשיט אחר.",
  },
  {
    id: "parrot",
    hintEmoji: "🦜",
    hintLabel: "תוכי",
    question: "איזו חיה ישבה על הכתף של שודד הים במפה?",
    options: ["דג", "תוכי", "חתול", "נחש"],
    correctIndex: 1,
    islandTitle: "אי התוכי",
    characterName: "סילבר זקן",
    failTitle: "התוכי עף לו!",
    failText: "על המפה ישב תוכי צבעוני על הכתף.",
  },
  {
    id: "anchor",
    hintEmoji: "⚓",
    hintLabel: "עוגן",
    question: "מה החזיק את הספינה במקום ליד החוף?",
    options: ["חבל", "עוגן", "סלע", "גשר"],
    correctIndex: 1,
    islandTitle: "אי העוגן",
    characterName: "המלחית רוּת",
    failTitle: "הספינה נסחפה!",
    failText: "עוגן כבד החזיק את הספינה במפה.",
  },
  {
    id: "skull",
    hintEmoji: "💀",
    hintLabel: "גולגולת",
    question: "איזה סמל סימן את אי הסכנה במפה?",
    options: ["לב", "כוכב", "גולגולת", "ירח"],
    correctIndex: 2,
    islandTitle: "אי הגולגולת",
    characterName: "שודד הצללים",
    failTitle: "נפלת במלכודת!",
    failText: "אי הסכנה סומן בגולגולת לבנה.",
  },
  {
    id: "compass",
    hintEmoji: "🧭",
    hintLabel: "מצפן",
    question: "באיזה כלי השתמשו כדי למצוא את הכיוון במפה?",
    options: ["מצפן", "משקפת", "פנס", "מפתח"],
    correctIndex: 0,
    islandTitle: "אי המצפן",
    characterName: "הנווט עמית",
    failTitle: "איבדת את הכיוון!",
    failText: "מצפן זהוב הצביע על הדרך במפה.",
  },
  {
    id: "lighthouse",
    hintEmoji: "🗼",
    hintLabel: "מגדלור",
    question: "מה האיר לספינות בלילה ליד האי?",
    options: ["ירח", "מגדלור", "מדורה", "כוכב"],
    correctIndex: 1,
    islandTitle: "אי המגדלור",
    characterName: "שומרת האור",
    failTitle: "טבעת בחושך!",
    failText: "מגדלור גבוה האיר את הדרך במפה.",
  },
  {
    id: "bottle",
    hintEmoji: "🍾",
    hintLabel: "בקבוק",
    question: "מה צף על המים עם מסר בתוכו?",
    options: ["תיבה", "בקבוק", "כדור", "נעל"],
    correctIndex: 1,
    islandTitle: "אי הבקבוק",
    characterName: "הזקן מהחוף",
    failTitle: "המסר אבד בים!",
    failText: "בקבוק זכוכית עם מכתב צף על המים במפה.",
  },
  {
    id: "chest",
    hintEmoji: "🧰",
    hintLabel: "תיבת אוצר",
    question: "היכן הוסתר האוצר הגדול ביותר במפה?",
    options: ["במערה", "בתיבת אוצר", "על עץ", "מתחת לסירה"],
    correctIndex: 1,
    islandTitle: "אי התיבה",
    characterName: "שומר האוצר",
    failTitle: "התיבה נעלמה!",
    failText: "האוצר הגדול הוסתר בתוך תיבת אוצר.",
  },
  {
    id: "crab",
    hintEmoji: "🦀",
    hintLabel: "סרטן",
    question: "איזה יצור הסתובב על החול האדום במפה?",
    options: ["צב", "סרטן", "צדפה", "כוכב ים"],
    correctIndex: 1,
    islandTitle: "אי הסרטן",
    characterName: "ילד החוף",
    failTitle: "ננשכת!",
    failText: "סרטן אדום הסתובב על החול במפה.",
  },
  {
    id: "key",
    hintEmoji: "🗝️",
    hintLabel: "מפתח",
    question: "מה פתח את שער המערה הנסתרת במפה?",
    options: ["מפתח", "פטיש", "חבל", "אבן"],
    correctIndex: 0,
    islandTitle: "אי המפתח",
    characterName: "שומרת המערה",
    failTitle: "השער נשאר נעול!",
    failText: "מפתח חלוד פתח את שער המערה במפה.",
  },
];
