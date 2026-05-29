// gameState.js
// Responsible for game state and flow transitions only.
// Does not depend on any specific riddle content and does not hardcode riddle ids.
// All rendering is done through renderer.js (the render* functions).

// The central game state. Rebuilt on every start.
const gameState = {
  selectedRiddles: [], // the riddles chosen for the current game, in route order
  currentIslandIndex: 0, // the current island (0-based)
  mapTimerId: null, // the map timer id, so it can be cancelled
  finished: false, // whether the game has ended (win/lose)
};

// The start screen.
function showStartScreen() {
  clearMapTimer();
  renderStartScreen();
}

// Start a new game: select a random route and show the map.
function startGame() {
  // Select and shuffle NUMBER_OF_ISLANDS riddles from the pool.
  gameState.selectedRiddles = pickRandom(RIDDLES, CONFIG.NUMBER_OF_ISLANDS);
  gameState.currentIslandIndex = 0;
  gameState.finished = false;

  showMap();
}

// Show the treasure map with the selected route, then start a timer that blows the map away.
function showMap() {
  // The map shows the same riddles, in the same order, that will be asked on the islands.
  renderMap(gameState.selectedRiddles);

  clearMapTimer();
  gameState.mapTimerId = setTimeout(function () {
    blowMapAway();
  }, CONFIG.MAP_VIEW_TIME_MS);
}

// Wind animation that blows the map away, then transitions to sailing to the first island.
function blowMapAway() {
  clearMapTimer();
  renderMapBlowAway(function () {
    sailToCurrentIsland();
  });
}

// Sailing animation, then show the current island's question.
function sailToCurrentIsland() {
  const islandNumber = gameState.currentIslandIndex + 1;
  renderSailing(islandNumber, CONFIG.NUMBER_OF_ISLANDS, function () {
    showCurrentIsland();
  });
}

// Show the question screen of the current island.
function showCurrentIsland() {
  const currentRiddle = gameState.selectedRiddles[gameState.currentIslandIndex];
  renderIsland(currentRiddle, gameState.currentIslandIndex, CONFIG.NUMBER_OF_ISLANDS);
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

// Advance to the next island, or win if all islands are done.
function advanceToNextIsland() {
  gameState.currentIslandIndex += 1;

  if (gameState.currentIslandIndex >= gameState.selectedRiddles.length) {
    winGame();
  } else {
    sailToCurrentIsland();
  }
}

// Lose: show an island-specific lose screen, with progress (island X of Y).
// chosenIndex is the original index of the wrong answer the player picked (may be undefined).
function loseGame(currentRiddle, chosenIndex) {
  gameState.finished = true;
  const reachedIsland = gameState.currentIslandIndex + 1;
  renderLoseScreen(currentRiddle, reachedIsland, CONFIG.NUMBER_OF_ISLANDS, chosenIndex);
}

// Win: all islands completed.
function winGame() {
  gameState.finished = true;
  renderWinScreen(CONFIG.NUMBER_OF_ISLANDS);
}

// Debug tool: automatically answer the current island correctly (only active in DEBUG_MODE).
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
