// gameState.js
// Responsible for game state and flow transitions only.
// Does not depend on any specific riddle content and does not hardcode riddle ids.
// All rendering is done through renderer.js (the render* functions).

// The central game state. Rebuilt on every start.
const gameState = {
  selectedRiddles: [], // generated map questions for the current game, in route order
  selectedMapAssets: [], // one randomized visual asset per configured category
  currentIslandIndex: 0, // the current question (0-based)
  mapTimerId: null, // the map timer id, so it can be cancelled
  finished: false, // whether the game has ended (win/lose)
};

// The start screen.
function showStartScreen() {
  clearMapTimer();
  renderStartScreen();
}

// Start a new game: select one random asset per category, build questions, and show the map.
function startGame() {
  gameState.selectedMapAssets = selectRandomMapAssets(
    ASSET_CATEGORIES,
    CONFIG.MAP_ASSET_LAYOUT
  );
  gameState.selectedRiddles = buildAssetQuestionRoute(
    gameState.selectedMapAssets,
    ASSET_CATEGORIES
  );
  gameState.currentIslandIndex = 0;
  gameState.finished = false;

  showMap();
}

// Show the treasure map with the selected assets, then start a timer that blows the map away.
function showMap() {
  renderMap(gameState.selectedRiddles, gameState.selectedMapAssets);

  clearMapTimer();
  gameState.mapTimerId = setTimeout(function () {
    blowMapAway();
  }, CONFIG.MAP_VIEW_TIME_MS);
}

// Wind animation that blows the map away, then transitions to the first question.
function blowMapAway() {
  clearMapTimer();
  renderMapBlowAway(function () {
    sailToCurrentIsland();
  });
}

// Sailing animation, then show the current question.
function sailToCurrentIsland() {
  const islandNumber = gameState.currentIslandIndex + 1;
  renderSailing(islandNumber, gameState.selectedRiddles.length, function () {
    showCurrentIsland();
  });
}

// Show the current question screen.
function showCurrentIsland() {
  const currentRiddle = gameState.selectedRiddles[gameState.currentIslandIndex];
  renderIsland(currentRiddle, gameState.currentIslandIndex, gameState.selectedRiddles.length);
}

// Handle the player's answer. Receives the original index of the selected option.
// Important: compare against correctIndex, not against the shuffled display index.
function answerCurrentIsland(originalIndex) {
  if (gameState.finished) {
    return;
  }
  const currentRiddle = gameState.selectedRiddles[gameState.currentIslandIndex];

  if (originalIndex === currentRiddle.correctIndex) {
    advanceToNextIsland();
  } else {
    loseGame(currentRiddle, originalIndex);
  }
}

// Advance to the next question, or win if all questions are done.
function advanceToNextIsland() {
  gameState.currentIslandIndex += 1;

  if (gameState.currentIslandIndex >= gameState.selectedRiddles.length) {
    winGame();
  } else {
    sailToCurrentIsland();
  }
}

// Lose: show a question result screen, with progress (question X of Y).
// chosenIndex is the original index of the wrong answer the player picked (may be undefined).
function loseGame(currentRiddle, chosenIndex) {
  gameState.finished = true;
  const reachedIsland = gameState.currentIslandIndex + 1;
  renderLoseScreen(currentRiddle, reachedIsland, gameState.selectedRiddles.length, chosenIndex);
}

// Win: all questions completed.
function winGame() {
  gameState.finished = true;
  renderWinScreen(gameState.selectedRiddles.length);
}

// Debug tool: automatically answer the current question correctly (only active in DEBUG_MODE).
function debugAnswerCorrectly() {
  if (!CONFIG.DEBUG_MODE || gameState.finished) {
    return;
  }
  const currentRiddle = gameState.selectedRiddles[gameState.currentIslandIndex];
  answerCurrentIsland(currentRiddle.correctIndex);
}

// Cancel the map timer if it is active.
function clearMapTimer() {
  if (gameState.mapTimerId !== null) {
    clearTimeout(gameState.mapTimerId);
    gameState.mapTimerId = null;
  }
}
