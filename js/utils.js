// utils.js
// General helper functions. No game logic here and no dependency on riddle content.

// Fisher-Yates shuffle. Returns a new shuffled array without mutating the original.
function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap element i with element j
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

// Randomly picks "count" items from an array, without repeats.
function pickRandom(array, count) {
  const safeCount = clamp(count, 0, array.length);
  return shuffle(array).slice(0, safeCount);
}

// Randomly picks one item from an array.
function pickOneRandom(array) {
  if (!array || array.length === 0) {
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
}

// Selects one random asset from each category that has a configured map layout.
// The returned objects merge catalog data with x/y/sizePercent placement settings.
function selectRandomMapAssets(assetCategories, layoutByCategory) {
  const selectedAssets = [];

  Object.keys(layoutByCategory).forEach(function (category) {
    const categoryData = assetCategories[category];
    const layout = layoutByCategory[category];

    if (!categoryData || !layout) {
      return;
    }

    const asset = pickOneRandom(categoryData.assets);

    if (!asset) {
      return;
    }

    selectedAssets.push({
      category: asset.category,
      path: asset.path,
      answer1: asset.answer1,
      answer2: asset.answer2,
      question1: categoryData.question1,
      question2: categoryData.question2,
      x: layout.x,
      y: layout.y,
      sizePercent: layout.sizePercent,
    });
  });

  return selectedAssets;
}

// Builds the question route from the randomized map assets.
// Each selected category gets one random question: question1/answer1 or question2/answer2.
function buildAssetQuestionRoute(selectedMapAssets, assetCategories) {
  const questions = selectedMapAssets.map(function (selectedAsset) {
    const categoryData = assetCategories[selectedAsset.category];
    const questionNumber = Math.random() < 0.5 ? 1 : 2;
    const questionKey = "question" + questionNumber;
    const answerKey = "answer" + questionNumber;
    const correctAnswer = selectedAsset[answerKey];
    const allAnswers = getUniqueValues(
      categoryData.assets.map(function (asset) {
        return asset[answerKey];
      })
    );
    const distractors = pickRandom(
      allAnswers.filter(function (answer) {
        return answer !== correctAnswer;
      }),
      3
    );
    const options = shuffle([correctAnswer].concat(distractors));

    return {
      id: "asset-" + selectedAsset.category,
      hintEmoji: "",
      hintLabel: "",
      hintImage: null,
      islandBackgroundImage: null,
      characterImage: null,
      loseImage: null,
      question: selectedAsset[questionKey],
      options: options,
      correctIndex: options.indexOf(correctAnswer),
      islandTitle: categoryData.islandTitle,
      characterName: categoryData.characterName,
      failTitle: categoryData.failTitle,
      failText: "התשובה הנכונה הייתה: " + correctAnswer,
    };
  });

  return shuffle(questions);
}

// Returns unique values while preserving first-seen order.
function getUniqueValues(values) {
  const seen = {};
  const uniqueValues = [];

  values.forEach(function (value) {
    if (value === undefined || value === null || seen[value]) {
      return;
    }
    seen[value] = true;
    uniqueValues.push(value);
  });

  return uniqueValues;
}

// Clamps a number to the range [min, max].
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Builds an options list that preserves the original index, then shuffles the display.
// Each item: { text, originalIndex }
// This lets us shuffle the answer buttons without losing which answer is correct.
function buildShuffledOptions(options) {
  const withIndex = options.map(function (text, originalIndex) {
    return { text: text, originalIndex: originalIndex };
  });
  return shuffle(withIndex);
}
