// assets.js
// Static image file catalog grouped by category.
// Keep this as a JavaScript file instead of JSON so the project works from file://.

const ANIMAL_FILES = [
  {
    category: "animal",
    path: "assets/characters/animal_0000.png",
    answer1: "תיש",
    answer2: "יונקים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0001.png",
    answer1: "דביבון",
    answer2: "טורפים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0002.png",
    answer1: "זאב",
    answer2: "טורפים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0003.png",
    answer1: "שועל",
    answer2: "טורפים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0004.png",
    answer1: "צבי",
    answer2: "יונקים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0005.png",
    answer1: "תנין",
    answer2: "זוחלים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0006.png",
    answer1: "כריש",
    answer2: "דגים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0007.png",
    answer1: "דוב",
    answer2: "טורפים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0008.png",
    answer1: "גורילה",
    answer2: "יונקים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0009.png",
    answer1: "אריה",
    answer2: "טורפים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0010.png",
    answer1: "עכביש",
    answer2: "חרקים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0011.png",
    answer1: "נשר",
    answer2: "עופות",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0013.png",
    answer1: "פיל",
    answer2: "יונקים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0014.png",
    answer1: "סוס",
    answer2: "יונקים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0016.png",
    answer1: "זברה",
    answer2: "יונקים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0017.png",
    answer1: "גמל",
    answer2: "יונקים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0018.png",
    answer1: "צב",
    answer2: "זוחלים",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0019.png",
    answer1: "פינגווין",
    answer2: "עופות",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0020.png",
    answer1: "קנגורו",
    answer2: "בעלי כיס",
  },
];

const TREASURE_FILES = [
  {
    category: "treasure",
    path: "assets/characters/treasure01.png",
    answer1: "כלי כסף",
    answer2: "גביע",
  },
  {
    category: "treasure",
    path: "assets/characters/treasure02.png",
    answer1: "זהב",
    answer2: "כתר",
  },
  {
    category: "treasure",
    path: "assets/characters/treasure03.png",
    answer1: "יהלומים",
    answer2: "יהלום",
  },
];

const STATUE_FILES = [
  {
    category: "statue",
    path: "assets/characters/statue_0001.png",
    answer1: "פסל אבן כועס",
    answer2: "אבן",
  },
  {
    category: "statue",
    path: "assets/characters/statue_0002.png",
    answer1: "פסל עץ כועס",
    answer2: "עץ",
  },
  {
    category: "statue",
    path: "assets/characters/statue_0003.png",
    answer1: "פסל אבן אריה",
    answer2: "אבן",
  },
  {
    category: "statue",
    path: "assets/characters/statue_0004.png",
    answer1: "פסל אבן בודהה",
    answer2: "אבן",
  },
  {
    category: "statue",
    path: "assets/characters/statue_0005.png",
    answer1: "פסל אבן נשר",
    answer2: "אבן",
  },
  {
    category: "statue",
    path: "assets/characters/statue_0006.png",
    answer1: "פסל אבן צוחק",
    answer2: "אבן",
  },
];

const VOLCANO_FILES = [
  {
    category: "volcano",
    path: "assets/characters/volcano_0000.png",
    answer1: "הר געש מתפרץ עם לבה",
    answer2: "כן",
  },
  {
    category: "volcano",
    path: "assets/characters/volcano_0001.png",
    answer1: "הר געש פעיל מעשן",
    answer2: "כן",
  },
  {
    category: "volcano",
    path: "assets/characters/volcano_0002.png",
    answer1: "הר געש לא פעיל",
    answer2: "לא",
  },
];

const FLAG_FILES = [
  {
    category: "flag",
    path: "assets/characters/flag_0000.png",
    answer1: "דגל אריה",
    answer2: "אדום",
  },
  {
    category: "flag",
    path: "assets/characters/flag_0001.png",
    answer1: "דגל שחור עם עיגול",
    answer2: "שחור/אפור",
  },
  {
    category: "flag",
    path: "assets/characters/flag_0002.png",
    answer1: "דגל פסים",
    answer2: "אדום/לבן",
  },
  {
    category: "flag",
    path: "assets/characters/flag_0003.png",
    answer1: "דגל פיראטים",
    answer2: "שחור",
  },
  {
    category: "flag",
    path: "assets/characters/flag_0004.png",
    answer1: "דגל עם משולשים",
    answer2: "חום",
  },
  {
    category: "flag",
    path: "assets/characters/flag_0005.png",
    answer1: "דגל עורב",
    answer2: "לבן",
  },
];

const TREE_FILES = [
  {
    category: "tree",
    path: "assets/characters/tree_0001.png",
    answer1: "עץ אלון",
    answer2: "בלוטים",
  },
  {
    category: "tree",
    path: "assets/characters/tree_0002.png",
    answer1: "עץ אשוח",
    answer2: "אצטרובלים",
  },
  {
    category: "tree",
    path: "assets/characters/tree_0003.png",
    answer1: "עץ דקל קוקוס",
    answer2: "אגוזי קוקוס",
  },
  {
    category: "tree",
    path: "assets/characters/tree_0005.png",
    answer1: "עץ ברוש",
    answer2: "אצטרובלים",
  },
  {
    category: "tree",
    path: "assets/characters/tree_0006.png",
    answer1: "עץ דובדבנים",
    answer2: "דובדבנים",
  },
  {
    category: "tree",
    path: "assets/characters/tree_0007.png",
    answer1: "עץ תפוזים",
    answer2: "תפוזים",
  },
];

const FOOD_FILES = [
  {
    category: "food",
    path: "assets/characters/food_0000.png",
    answer1: "נקניק",
    answer2: "בשר",
  },
  {
    category: "food",
    path: "assets/characters/food_0001.png",
    answer1: "שרימפס",
    answer2: "פירות ים",
  },
  {
    category: "food",
    path: "assets/characters/food_0002.png",
    answer1: "פאי רועים",
    answer2: "מאפה",
  },
  {
    category: "food",
    path: "assets/characters/food_0003.png",
    answer1: "מרק",
    answer2: "תבשיל",
  },
  {
    category: "food",
    path: "assets/characters/food_0004.png",
    answer1: "צדפות",
    answer2: "פירות ים",
  },
  {
    category: "food",
    path: "assets/characters/food_0005.png",
    answer1: "דג",
    answer2: "דגים",
  },
  {
    category: "food",
    path: "assets/characters/food_0006.png",
    answer1: "רום",
    answer2: "משקה",
  },
];

const ASSET_CATEGORY_QUESTIONS = {
    animal: {
        question1: "איזו חיה הופיעה במפה?",
        question2: "לאיזו משפחה שייכת החיה?",
    },
    treasure: {
        question1: "איזה אוצר הופיע במפה?",
        question2: "מהו הפריט היקר ביותר באוצר?",
    },
    statue: {
        question1: "איזה פסל הופיע במפה?",
        question2: "מה החומר ממנו עשוי הפסל?",
    },
    volcano: {
        question1: "איזה הר געש הופיע במפה?",
        question2: "האם הר הגעש היה פעיל?",
    },
    flag: {
        question1: "איזה דגל הופיע במפה?",
        question2: "מה היה צבע הבד של הדגל?",
    },
    tree: {
        question1: "איזה עץ הופיע במפה?",
        question2: "מהם פירות העץ?",
    },
    food: {
        question1: "איזה אוכל הופיע במפה?",
        question2: "לאיזה סוג מאכל הוא שייך?",
    },
};

const FILES_BY_CATEGORY = {
  animal: ANIMAL_FILES,
  treasure: TREASURE_FILES,
  statue: STATUE_FILES,
  volcano: VOLCANO_FILES,
  flag: FLAG_FILES,
  tree: TREE_FILES,
  food: FOOD_FILES,
};

const FILES = [
  ...ANIMAL_FILES,
  ...TREASURE_FILES,
  ...STATUE_FILES,
  ...VOLCANO_FILES,
  ...FLAG_FILES,
  ...TREE_FILES,
  ...FOOD_FILES,
];

const ASSETS_BY_CATEGORY = FILES_BY_CATEGORY;
const ASSETS = FILES;

const ASSET_CATEGORIES = {
  animal: {
    question1: ASSET_CATEGORY_QUESTIONS.animal.question1,
    question2: ASSET_CATEGORY_QUESTIONS.animal.question2,
    islandEmoji: "🐾",
    islandTitle: "שאלת החיות",
    characterEmoji: "🦜",
    characterName: "שומר החיות",
    failTitle: "החיה חמקה!",
    assets: ANIMAL_FILES,
  },
  treasure: {
    question1: ASSET_CATEGORY_QUESTIONS.treasure.question1,
    question2: ASSET_CATEGORY_QUESTIONS.treasure.question2,
    islandEmoji: "💎",
    islandTitle: "שאלת האוצר",
    characterEmoji: "🏴‍☠️",
    characterName: "שומר האוצר",
    failTitle: "האוצר נעלם!",
    assets: TREASURE_FILES,
  },
  statue: {
    question1: ASSET_CATEGORY_QUESTIONS.statue.question1,
    question2: ASSET_CATEGORY_QUESTIONS.statue.question2,
    islandEmoji: "🗿",
    islandTitle: "שאלת הפסלים",
    characterEmoji: "🧭",
    characterName: "חוקר הפסלים",
    failTitle: "הפסל בלבל אותך!",
    assets: STATUE_FILES,
  },
  volcano: {
    question1: ASSET_CATEGORY_QUESTIONS.volcano.question1,
    question2: ASSET_CATEGORY_QUESTIONS.volcano.question2,
    islandEmoji: "🌋",
    islandTitle: "שאלת הר הגעש",
    characterEmoji: "🔥",
    characterName: "שומר הלבה",
    failTitle: "הלבה התפרצה!",
    assets: VOLCANO_FILES,
  },
  flag: {
    question1: ASSET_CATEGORY_QUESTIONS.flag.question1,
    question2: ASSET_CATEGORY_QUESTIONS.flag.question2,
    islandEmoji: "🚩",
    islandTitle: "שאלת הדגלים",
    characterEmoji: "⚓",
    characterName: "קצין הדגלים",
    failTitle: "הדגל הונף לא נכון!",
    assets: FLAG_FILES,
  },
  tree: {
    question1: ASSET_CATEGORY_QUESTIONS.tree.question1,
    question2: ASSET_CATEGORY_QUESTIONS.tree.question2,
    islandEmoji: "🌴",
    islandTitle: "שאלת העצים",
    characterEmoji: "🍃",
    characterName: "שומר היער",
    failTitle: "הלכת לאיבוד ביער!",
    assets: TREE_FILES,
  },
  food: {
    question1: ASSET_CATEGORY_QUESTIONS.food.question1,
    question2: ASSET_CATEGORY_QUESTIONS.food.question2,
    islandEmoji: "🍲",
    islandTitle: "שאלת האוכל",
    characterEmoji: "👨‍🍳",
    characterName: "טבח הספינה",
    failTitle: "הארוחה התקלקלה!",
    assets: FOOD_FILES,
  },
};
