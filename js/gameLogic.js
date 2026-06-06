// gameLogic.js
// Builds randomized map assets and question routes from catalog data.
// No DOM; depends on generic helpers in utils.js.

// Selects one random asset from randomized categories that have configured map layout.
// The returned objects merge catalog data with x/y/sizePercent placement settings.
function selectRandomMapAssets(assetCategories, layoutByCategory, assetCount, requiredCategory) {
  const selectedAssets = [];
  const categoryKeys = Object.keys(layoutByCategory).filter(function (category) {
    return Boolean(assetCategories[category]);
  });
  const targetCount =
    typeof assetCount === "number" ? clamp(assetCount, 0, categoryKeys.length) : categoryKeys.length;
  let selectedCategories = [];

  if (targetCount === 0) {
    return selectedAssets;
  }

  if (requiredCategory && categoryKeys.indexOf(requiredCategory) !== -1) {
    selectedCategories.push(requiredCategory);
  }

  const optionalCategories = categoryKeys.filter(function (category) {
    return category !== requiredCategory;
  });
  selectedCategories = selectedCategories.concat(
    pickRandom(optionalCategories, targetCount - selectedCategories.length)
  );
  selectedCategories = shuffle(selectedCategories).slice(0, targetCount);

  selectedCategories.forEach(function (category) {
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
// Each selected image first gets one random question. Extra questions use the second
// question from randomized selected categories, so the map still shows only one image.
function buildAssetQuestionRoute(selectedMapAssets, assetCategories, questionCount) {
  const targetCount =
    typeof questionCount === "number"
      ? clamp(questionCount, 0, selectedMapAssets.length * 2)
      : selectedMapAssets.length;
  const primaryQuestions = selectedMapAssets.map(function (selectedAsset) {
    const questionNumber = Math.random() < 0.5 ? 1 : 2;
    return buildQuestionForAsset(selectedAsset, assetCategories, questionNumber);
  });

  if (targetCount <= primaryQuestions.length) {
    return cleanGeneratedQuestions(shuffle(primaryQuestions).slice(0, targetCount));
  }

  const extraQuestions = shuffle(
    selectedMapAssets.map(function (selectedAsset, index) {
      const secondQuestionNumber = primaryQuestions[index].questionNumber === 1 ? 2 : 1;
      return buildQuestionForAsset(selectedAsset, assetCategories, secondQuestionNumber);
    })
  );
  const questions = primaryQuestions.concat(
    extraQuestions.slice(0, targetCount - primaryQuestions.length)
  );

  return cleanGeneratedQuestions(shuffle(questions));
}

function buildQuestionForAsset(selectedAsset, assetCategories, questionNumber) {
  const categoryData = assetCategories[selectedAsset.category];
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
    id: "asset-" + selectedAsset.category + "-q" + questionNumber,
    questionNumber: questionNumber,
    question: selectedAsset[questionKey],
    options: options,
    correctIndex: options.indexOf(correctAnswer),
    islandEmoji: categoryData.islandEmoji,
    islandTitle: categoryData.islandTitle,
    characterEmoji: categoryData.characterEmoji,
    characterName: categoryData.characterName,
    failTitle: categoryData.failTitle,
    failText: "התשובה הנכונה הייתה: " + correctAnswer,
  };
}

// Removes internal fields before the question reaches rendering/gameplay code.
function cleanGeneratedQuestion(question) {
  return {
    id: question.id,
    question: question.question,
    options: question.options,
    correctIndex: question.correctIndex,
    islandEmoji: question.islandEmoji,
    islandTitle: question.islandTitle,
    characterEmoji: question.characterEmoji,
    characterName: question.characterName,
    failTitle: question.failTitle,
    failText: question.failText,
  };
}

function cleanGeneratedQuestions(questions) {
  return questions.map(function (question) {
    return cleanGeneratedQuestion(question);
  });
}
