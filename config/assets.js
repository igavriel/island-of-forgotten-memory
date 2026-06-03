// files.js
// Static image file catalog grouped by category.
// Keep this as a JavaScript file instead of JSON so the project works from file://.

const ANIMAL_FILES = [
  {
    category: "animal",
    path: "assets/characters/animal_0000.png",
    name: "תיש",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0001.png",
    name: "דביבון",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0002.png",
    name: "זאב",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0003.png",
    name: "שועל",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0004.png",
    name: "צבי",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0005.png",
    name: "תנין",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0006.png",
    name: "כריש",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0007.png",
    name: "דוב",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0008.png",
    name: "גורילה",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0009.png",
    name: "אריה",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0010.png",
    name: "עכביש",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0011.png",
    name: "נשר",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0013.png",
    name: "פיל",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0014.png",
    name: "סוס",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0016.png",
    name: "זברה",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0017.png",
    name: "גמל",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0018.png",
    name: "צב",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0019.png",
    name: "פינגווין",
  },
  {
    category: "animal",
    path: "assets/characters/animal_0020.png",
    name: "קנגורו",
  },
];

const TREASURE_FILES = [
  {
    category: "treasure",
    path: "assets/characters/treasure01.png",
    name: "כלי כסף",
  },
  {
    category: "treasure",
    path: "assets/characters/treasure02.png",
    name: "זהב",
  },
  {
    category: "treasure",
    path: "assets/characters/treasure03.png",
    name: "יהלומים",
  },
];

const STATUE_FILES = [
  {
    category: "statue",
    path: "assets/characters/statue_0001.png",
    name: "פסל אבן כועס",
  },
  {
    category: "statue",
    path: "assets/characters/statue_0002.png",
    name: "פסל עץ כועס",
  },
  {
    category: "statue",
    path: "assets/characters/statue_0003.png",
    name: "פסל אבן אריה",
  },
  {
    category: "statue",
    path: "assets/characters/statue_0004.png",
    name: "פסל אבן בודהה",
  },
  {
    category: "statue",
    path: "assets/characters/statue_0005.png",
    name: "פסל אבן נשר",
  },
  {
    category: "statue",
    path: "assets/characters/statue_0006.png",
    name: "פסל אבן צוחק",
  },
];

const VOLCANO_FILES = [
  {
    category: "volcano",
    path: "assets/characters/volcano_0000.png",
    name: "הר געש מתפרץ עם לבה",
  },
  {
    category: "volcano",
    path: "assets/characters/volcano_0001.png",
    name: "הר געש פעיל מעשן",
  },
  {
    category: "volcano",
    path: "assets/characters/volcano_0002.png",
    name: "הר געש לא פעיל",
  },
];

const FLAG_FILES = [
  {
    category: "flag",
    path: "assets/characters/flag_0000.png",
    name: "דגל אריה",
  },
  {
    category: "flag",
    path: "assets/characters/flag_0001.png",
    name: "דגל שחור עם עיגול",
  },
  {
    category: "flag",
    path: "assets/characters/flag_0002.png",
    name: "דגל פסים",
  },
  {
    category: "flag",
    path: "assets/characters/flag_0003.png",
    name: "דגל פיראטים",
  },
  {
    category: "flag",
    path: "assets/characters/flag_0004.png",
    name: "דגל לבן עם משולשים",
  },
  {
    category: "flag",
    path: "assets/characters/flag_0005.png",
    name: "דגל עורב",
  },
];

const TREE_FILES = [
  {
    category: "tree",
    path: "assets/characters/tree_0001.png",
    name: "עץ אלון",
  },
  {
    category: "tree",
    path: "assets/characters/tree_0002.png",
    name: "עץ אשוח",
  },
  {
    category: "tree",
    path: "assets/characters/tree_0003.png",
    name: "עץ דקל קוקוס",
  },
  {
    category: "tree",
    path: "assets/characters/tree_0005.png",
    name: "עץ ברוש",
  },
  {
    category: "tree",
    path: "assets/characters/tree_0006.png",
    name: "עץ דובדבנים",
  },
  {
    category: "tree",
    path: "assets/characters/tree_0007.png",
    name: "עץ תפוזים",
  },
];

const FOOD_FILES = [
  {
    category: "food",
    path: "assets/characters/food_0000.png",
    name: "נקניק",
  },
  {
    category: "food",
    path: "assets/characters/food_0001.png",
    name: "שרימפס",
  },
  {
    category: "food",
    path: "assets/characters/food_0002.png",
    name: "פאי רועים",
  },
  {
    category: "food",
    path: "assets/characters/food_0003.png",
    name: "מרק",
  },
  {
    category: "food",
    path: "assets/characters/food_0004.png",
    name: "צדפות",
  },
  {
    category: "food",
    path: "assets/characters/food_0005.png",
    name: "דג",
  },
  {
    category: "food",
    path: "assets/characters/food_0006.png",
    name: "רום",
  },
];

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
