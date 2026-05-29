// renderer.js
// Responsible for all DOM rendering. Holds no game state and decides no flow.
// The flow functions (gameState.js) call the render* functions here.

// The root element into which all screens are injected.
function getRoot() {
  return document.getElementById("game");
}

// Clears the screen and returns the root element.
function clearScreen() {
  const root = getRoot();
  root.innerHTML = "";
  return root;
}

// Small helper to create an element with a class and text.
function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (text !== undefined && text !== null) {
    el.textContent = text;
  }
  return el;
}

// Appends an <img> when image mode is on and a source path is set; otherwise appends
// the emoji/text placeholder. If the image fails to load (missing/renamed file), the
// placeholder is swapped back in, so the prototype never shows a broken image.
// altText: meaningful description for informative images (e.g. a hint label),
//          or "" for decorative images (backgrounds, lose art).
function appendVisual(parent, src, placeholderEl, className, altText) {
  if (CONFIG.USE_IMAGE_ASSETS && src) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = altText || "";
    img.className = className;
    img.addEventListener("error", function () {
      img.replaceWith(placeholderEl);
    });
    parent.appendChild(img);
  } else {
    parent.appendChild(placeholderEl);
  }
}

// ---- Start screen ----
function renderStartScreen() {
  const root = clearScreen();
  const screen = createElement("section", "screen start-screen fade-in");

  screen.appendChild(createElement("div", "big-emoji", "🏴‍☠️"));
  screen.appendChild(createElement("h1", "title", "אי הזיכרון האבוד"));
  screen.appendChild(
    createElement(
      "p",
      "subtitle",
      "הביטו היטב במפת האוצר! לאחר מספר שניות הרוח תעיף אותה, ותצטרכו לזכור את הרמזים כדי לעבור בין האיים."
    )
  );

  const info = createElement(
    "p",
    "hint-text",
    "מספר איים: " +
      CONFIG.NUMBER_OF_ISLANDS +
      "  •  זמן צפייה במפה: " +
      Math.round(CONFIG.MAP_VIEW_TIME_MS / 1000) +
      " שניות"
  );
  screen.appendChild(info);

  const startButton = createElement("button", "main-button", "התחילו את ההרפתקה");
  startButton.addEventListener("click", startGame);
  screen.appendChild(startButton);

  root.appendChild(screen);
}

// ---- Treasure map ----
// Shows the selected riddles, in route order. This is the player's memory source.
function renderMap(selectedRiddles) {
  const root = clearScreen();
  const screen = createElement("section", "screen map-screen");

  const mapCard = createElement("div", "map-card map-reveal");
  mapCard.appendChild(createElement("h2", "map-title", "🗺️ מפת האוצר"));
  mapCard.appendChild(
    createElement("p", "map-subtitle", "זכרו את הרמזים לפי הסדר!")
  );

  const route = createElement("ol", "map-route");
  selectedRiddles.forEach(function (riddle, index) {
    const item = createElement("li", "map-clue");

    const number = createElement("span", "clue-number", index + 1);
    item.appendChild(number);

    // Image clue if available (image mode on), otherwise the emoji placeholder.
    const emoji = createElement("span", "clue-emoji", riddle.hintEmoji);
    appendVisual(item, riddle.hintImage, emoji, "map-clue-image", riddle.hintLabel);

    // The label is shown only if enabled in the config. The final version shows a visual clue only.
    if (CONFIG.SHOW_HINT_LABELS_ON_MAP) {
      item.appendChild(createElement("span", "clue-label", riddle.hintLabel));
    }

    route.appendChild(item);
  });
  mapCard.appendChild(route);

  // Visual timer bar that empties over the map viewing time.
  const timerBar = createElement("div", "timer-bar");
  const timerFill = createElement("div", "timer-fill");
  timerFill.style.animationDuration = CONFIG.MAP_VIEW_TIME_MS + "ms";
  timerBar.appendChild(timerFill);
  mapCard.appendChild(timerBar);

  screen.appendChild(mapCard);
  root.appendChild(screen);
}

// Wind animation that blows the map away, then calls the callback when done.
// A short Hebrew message appears while the map flies off. The map is never re-rendered,
// so the player cannot reopen it.
function renderMapBlowAway(callback) {
  const mapCard = document.querySelector(".map-card");
  if (!mapCard) {
    callback();
    return;
  }
  mapCard.classList.remove("map-reveal");
  mapCard.classList.add("map-blow-away");

  const screen = mapCard.closest(".screen") || getRoot();
  const message = createElement("div", "wind-message", "💨 הרוח העיפה את המפה!");
  screen.appendChild(message);

  runAfterAnimation(mapCard, callback, 1200);
}

// ---- Sailing-between-islands screen ----
function renderSailing(islandNumber, totalIslands, callback) {
  const root = clearScreen();
  const screen = createElement("section", "screen sailing-screen fade-in");

  screen.appendChild(createElement("h2", "title", "מפליגים לאי הבא..."));
  screen.appendChild(
    createElement("p", "subtitle", "אי " + islandNumber + " מתוך " + totalIslands)
  );

  // The sea holds a ship that sails across the waves (animated in CSS).
  const sea = createElement("div", "sea");
  sea.appendChild(createElement("div", "ship", "⛵"));
  sea.appendChild(createElement("div", "waves", "🌊🌊🌊🌊🌊🌊🌊"));
  screen.appendChild(sea);

  root.appendChild(screen);

  // Move to the island question after the configured sailing time.
  setTimeout(callback, CONFIG.SAILING_TIME_MS);
}

// ---- Island question screen ----
function renderIsland(riddle, islandIndex, totalIslands) {
  const root = clearScreen();
  const screen = createElement("section", "screen island-screen fade-in");

  const islandNumber = islandIndex + 1;
  screen.appendChild(
    createElement("p", "progress", "אי " + islandNumber + " מתוך " + totalIslands)
  );
  // Island background image if available, otherwise the emoji placeholder. Decorative => empty alt.
  const islandPlaceholder = createElement("div", "big-emoji", "🏝️");
  appendVisual(screen, riddle.islandBackgroundImage, islandPlaceholder, "island-background", "");
  screen.appendChild(createElement("h2", "island-title", riddle.islandTitle));

  const character = createElement("div", "character-box");
  // Character image if available, otherwise the emoji placeholder. Named by characterName for alt.
  const characterPlaceholder = createElement("div", "character-emoji", "🧑‍✈️");
  appendVisual(character, riddle.characterImage, characterPlaceholder, "character-image", riddle.characterName);
  character.appendChild(createElement("p", "character-name", riddle.characterName));
  character.appendChild(createElement("p", "question", riddle.question));
  screen.appendChild(character);

  // Build options preserving the original index, then shuffle the display.
  const options = buildShuffledOptions(riddle.options);
  const optionsBox = createElement("div", "options");
  options.forEach(function (option) {
    const button = createElement("button", "option-button", option.text);

    // In debug mode, mark the correct answer.
    if (CONFIG.DEBUG_MODE && option.originalIndex === riddle.correctIndex) {
      button.classList.add("debug-correct");
      button.textContent = option.text + "  ✓";
    }

    // On click, pass the original index, not the display index.
    button.addEventListener("click", function () {
      button.classList.add("clicked");
      answerCurrentIsland(option.originalIndex);
    });

    optionsBox.appendChild(button);
  });
  screen.appendChild(optionsBox);

  // Developer tool: skip/answer-correctly button. Documented as false for the final presentation.
  if (CONFIG.DEBUG_MODE) {
    const debugBox = createElement("div", "debug-box");
    debugBox.appendChild(
      createElement("p", "debug-note", "מצב פיתוח פעיל — התשובה הנכונה מסומנת ב-✓")
    );
    const skipButton = createElement("button", "debug-button", "דלג (תשובה נכונה)");
    skipButton.addEventListener("click", debugAnswerCorrectly);
    debugBox.appendChild(skipButton);
    screen.appendChild(debugBox);
  }

  root.appendChild(screen);
}

// ---- Lose screen ----
// chosenIndex is the original index of the wrong answer the player picked (may be undefined).
function renderLoseScreen(riddle, reachedIsland, totalIslands, chosenIndex) {
  const root = clearScreen();
  const screen = createElement("section", "screen lose-screen fade-in");

  // Lose image if available, otherwise the emoji placeholder. Decorative => empty alt.
  const losePlaceholder = createElement("div", "big-emoji", "💀");
  appendVisual(screen, riddle.loseImage, losePlaceholder, "lose-image", "");
  screen.appendChild(createElement("h2", "title", riddle.failTitle));
  screen.appendChild(createElement("p", "subtitle", riddle.failText));

  // Answer review: the player's wrong choice (if known) and the correct answer.
  const review = createElement("div", "answer-review");
  if (typeof chosenIndex === "number" && riddle.options[chosenIndex] !== undefined) {
    const wrongRow = createElement("p", "answer-row answer-wrong");
    wrongRow.appendChild(createElement("span", "answer-label", "בחרת:"));
    wrongRow.appendChild(createElement("span", "answer-value", riddle.options[chosenIndex]));
    review.appendChild(wrongRow);
  }
  const correctRow = createElement("p", "answer-row answer-correct");
  correctRow.appendChild(createElement("span", "answer-label", "התשובה הנכונה:"));
  correctRow.appendChild(
    createElement("span", "answer-value", riddle.options[riddle.correctIndex])
  );
  review.appendChild(correctRow);
  screen.appendChild(review);

  screen.appendChild(
    createElement(
      "p",
      "progress",
      "הגעת לאי " + reachedIsland + " מתוך " + totalIslands
    )
  );

  const again = createElement("button", "main-button", "שחקו שוב");
  again.addEventListener("click", startGame);
  screen.appendChild(again);

  root.appendChild(screen);
}

// ---- Win screen ----
function renderWinScreen(totalIslands) {
  const root = clearScreen();
  const screen = createElement("section", "screen win-screen fade-in");

  screen.appendChild(createElement("div", "big-emoji", "🏆"));
  screen.appendChild(createElement("h2", "title", "מצאת את האוצר!"));
  screen.appendChild(
    createElement(
      "p",
      "subtitle",
      "עברת את כל " + totalIslands + " האיים בזכות זיכרון מצוין!"
    )
  );
  screen.appendChild(
    createElement("p", "score", "ניקוד: " + totalIslands + " מתוך " + totalIslands)
  );

  const again = createElement("button", "main-button", "שחקו שוב");
  again.addEventListener("click", startGame);
  screen.appendChild(again);

  root.appendChild(screen);
}

// Runs a callback when an element's animation ends, with a fallback timeout if no event fires.
function runAfterAnimation(element, callback, fallbackMs) {
  let done = false;
  function finish() {
    if (done) {
      return;
    }
    done = true;
    element.removeEventListener("animationend", finish);
    callback();
  }
  element.addEventListener("animationend", finish);
  setTimeout(finish, fallbackMs);
}
