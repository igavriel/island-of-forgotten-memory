// renderer.js
// Responsible for all DOM rendering. Holds no game state and decides no flow.
// The flow functions (gameState.js) call the render* functions here.

// The root element into which all screens are injected (#screen inside #game-viewport).
function getRoot() {
  return document.getElementById("screen");
}

// Pushes the configurable transition timings into CSS custom properties, so the CSS
// animations and the JS flow timers share a single source of truth (CONFIG). Called once
// at startup. Other (purely cosmetic) durations stay as fixed values in the stylesheet.
function applyAnimationTimings() {
  const root = document.documentElement;
  root.style.setProperty("--wind-ms", CONFIG.WIND_TRANSITION_MS + "ms");
  root.style.setProperty("--sail-ms", CONFIG.SAILING_TRANSITION_MS + "ms");
  root.style.setProperty("--answer-feedback-ms", CONFIG.ANSWER_FEEDBACK_MS + "ms");
}

// Clears the screen and returns the root element.
function clearScreen() {
  const root = getRoot();
  root.innerHTML = "";
  root.classList.remove("is-map-screen");
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

// Appends an <img> when a source path exists; otherwise appends the placeholder.
// placeholder. So images are used automatically wherever they exist, and everything else
// falls back to the placeholder. If the image fails to load (missing/renamed file), the
// placeholder is swapped back in, so the game never shows a broken image. CONFIG.USE_IMAGE_ASSETS
// is an optional override: set it to false to force placeholder-only mode (ignore all paths).
// altText: meaningful description for informative images (e.g. a hint label),
//          or "" for decorative images.
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

// Sets (or clears) the full-screen background for the current screen (#screen-bg inside
// #game-viewport). The image is preloaded so a missing/failed file falls back cleanly.
// Pass null/undefined to clear the background.
// "enabled" defaults to CONFIG.USE_SCREEN_PLACEHOLDER_IMAGES for screen-level images;
// generated question backgrounds pass CONFIG.USE_IMAGE_ASSETS instead.
function setScreenBackground(src, enabled) {
  const layer = document.getElementById("screen-bg");
  if (!layer) {
    return;
  }
  const allow = enabled === undefined ? CONFIG.USE_SCREEN_PLACEHOLDER_IMAGES : enabled;
  function clear() {
    layer.style.backgroundImage = "";
    layer.style.backgroundSize = "";
    layer.style.backgroundPosition = "";
    layer.style.backgroundRepeat = "";
    layer.classList.remove("is-visible");
  }
  if (allow && src) {
    const probe = new Image();
    probe.onload = function () {
      layer.style.backgroundImage = "url('" + src + "')";
      layer.style.backgroundSize = "contain";
      layer.style.backgroundPosition = "center";
      layer.style.backgroundRepeat = "no-repeat";
      layer.classList.add("is-visible");
    };
    probe.onerror = clear;
    probe.src = src;
  } else {
    clear();
  }
}

// ---- Start screen ----
function renderStartScreen(difficultyLevels) {
  const root = clearScreen();
  setScreenBackground(CONFIG.START_SCREEN_IMAGE);
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
    "זמן צפייה במפה: " +
      Math.round(CONFIG.MAP_VIEW_TIME_MS / 1000) +
      " שניות"
  );
  screen.appendChild(info);

  screen.appendChild(createElement("p", "difficulty-question", "איזו רמה לשחק?"));

  const difficultyBox = createElement("div", "difficulty-options");
  Object.keys(difficultyLevels).forEach(function (difficultyKey) {
    const difficulty = difficultyLevels[difficultyKey];
    const button = createElement("button", "main-button difficulty-button", difficulty.label);
    button.addEventListener("click", function () {
      startGame(difficultyKey);
    });
    difficultyBox.appendChild(button);
  });
  screen.appendChild(difficultyBox);

  root.appendChild(screen);
}

// ---- Treasure map ----
// Shows the randomized map assets. This is the player's memory source.
function renderMap(selectedMapAssets) {
  const root = clearScreen();
  root.classList.add("is-map-screen");
  setScreenBackground(null);
  const screen = createElement("section", "screen map-screen");

  const mapCard = createElement("div", "map-card map-reveal");
  const mapImage = document.createElement("img");
  mapImage.src = CONFIG.MAP_BACKGROUND_IMAGE;
  mapImage.alt = "מפת האוצר";
  mapImage.className = "map-background-image";
  mapCard.appendChild(mapImage);

  const mapHeader = createElement("header", "map-header");
  mapHeader.appendChild(createElement("h2", "map-title", "🗺️ מפת האוצר"));
  // The pulsing cue makes the memory phase feel intentional: "memorize this now".
  mapHeader.appendChild(
    createElement("p", "map-subtitle memorize-cue", "זכרו את הרמזים!")
  );
  mapCard.appendChild(mapHeader);

  mapCard.appendChild(renderMapAssets(selectedMapAssets || []));

  // Optional numeric countdown (kept off by default for a calmer look).
  if (CONFIG.SHOW_COUNTDOWN_NUMBER) {
    const countdown = createElement("p", "countdown-number", "");
    mapCard.appendChild(countdown);
    startCountdown(countdown, CONFIG.MAP_VIEW_TIME_MS);
  }

  // Visual timer bar that empties over the map viewing time.
  const timerBar = createElement("div", "timer-bar");
  const timerFill = createElement("div", "timer-fill");
  timerFill.style.animationDuration = CONFIG.MAP_VIEW_TIME_MS + "ms";
  timerBar.appendChild(timerFill);
  const timerWrap = createElement("div", "map-timer");
  timerWrap.appendChild(timerBar);
  mapCard.appendChild(timerWrap);

  screen.appendChild(mapCard);
  root.appendChild(screen);
}

// Renders one randomized image per category using CONFIG.MAP_ASSET_LAYOUT placement.
// x/y/sizePercent are relative percentages, so the layout scales with the map area.
function renderMapAssets(selectedMapAssets) {
  const layer = createElement("div", "map-assets-layer");

  selectedMapAssets.forEach(function (asset) {
    const image = document.createElement("img");
    image.src = asset.path;
    image.alt = asset.answer1;
    image.className = "map-positioned-asset";
    image.style.left = asset.x + "%";
    image.style.top = asset.y + "%";
    image.style.width = asset.sizePercent + "%";
    image.addEventListener("error", function () {
      image.remove();
    });
    layer.appendChild(image);
  });

  return layer;
}

// Updates a "נותרו N שניות" countdown once per second. Self-clears when the element
// leaves the DOM (e.g. the map blew away), so no timer is left running.
function startCountdown(element, totalMs) {
  const endTime = Date.now() + totalMs;
  function tick() {
    if (!document.body.contains(element)) {
      clearInterval(intervalId);
      return;
    }
    const secondsLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    element.textContent = "נותרו " + secondsLeft + " שניות";
  }
  tick();
  const intervalId = setInterval(tick, 250);
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
  // Clear reminder that the map is gone for good and cannot be reopened.
  const message = createElement("div", "wind-message", "💨 הרוח העיפה את המפה! אי אפשר לפתוח אותה שוב");
  screen.appendChild(message);

  // Fallback slightly longer than the wind transition, in case animationend never fires.
  runAfterAnimation(mapCard, callback, CONFIG.WIND_TRANSITION_MS + 150);
}

// ---- Sailing-between-islands screen ----
function renderSailing(questionNumber, totalQuestions, callback) {
  const root = clearScreen();
  // Full-screen 16:9 sea background (same #screen-bg layer as start/map/win).
  setScreenBackground(CONFIG.SAILING_BACKGROUND_IMAGE);
  const screen = createElement("section", "screen sailing-screen fade-in");

  // Transparent overlay for ship + island sprites (background is on #screen-bg).
  const scene = createElement("div", "sailing-scene");

  const islandWrap = createElement("div", "destination-island");
  const islandPlaceholder = createElement("span", "destination-island-emoji", "🏝️");
  appendVisual(
    islandWrap,
    CONFIG.SAILING_DESTINATION_ISLAND_IMAGE,
    islandPlaceholder,
    "destination-island-img",
    ""
  );
  scene.appendChild(islandWrap);

  const shipWrap = createElement("div", "sailing-ship");
  const shipPlaceholder = createElement("span", "sailing-ship-emoji", "⛵");
  appendVisual(
    shipWrap,
    CONFIG.SAILING_SHIP_IMAGE,
    shipPlaceholder,
    "sailing-ship-img",
    ""
  );
  scene.appendChild(shipWrap);

  screen.appendChild(scene);
  // Plain text over the sky area — no panel/card; readability via text-shadow in CSS.
  screen.appendChild(createElement("p", "sailing-message", "מתקדמים לשאלה הבאה..."));
  screen.appendChild(
    createElement(
      "p",
      "sailing-progress",
      "שאלה " + questionNumber + " מתוך " + totalQuestions
    )
  );
  root.appendChild(screen);

  // Move to the island question after the configured sailing time (--sail-ms in CSS).
  setTimeout(callback, CONFIG.SAILING_TRANSITION_MS);
}

// ---- Island question screen ----
function renderIsland(questionData, questionIndex, totalQuestions) {
  const root = clearScreen();
  setScreenBackground(questionData.backgroundImage, CONFIG.USE_IMAGE_ASSETS);
  const screen = createElement("section", "screen island-screen fade-in");

  const questionNumber = questionIndex + 1;
  screen.appendChild(
    createElement("p", "progress", "שאלה " + questionNumber + " מתוך " + totalQuestions)
  );
  screen.appendChild(createElement("div", "big-emoji", questionData.islandEmoji));
  screen.appendChild(createElement("h2", "island-title", questionData.islandTitle));

  // The question card gets a small entrance animation so the next question arrives clearly.
  const character = createElement("div", "character-box character-enter");
  const characterPlaceholder = createElement(
    "div",
    "character-emoji",
    questionData.characterEmoji
  );
  appendVisual(
    character,
    questionData.characterImage,
    characterPlaceholder,
    "character-image",
    questionData.characterName
  );
  character.appendChild(createElement("p", "character-name", questionData.characterName));
  character.appendChild(createElement("p", "question", questionData.question));
  screen.appendChild(character);

  // Build options preserving the original index, then shuffle the display.
  const options = buildShuffledOptions(questionData.options);
  const optionsBox = createElement("div", "options");

  // Guard so only the first click counts during the short feedback moment.
  let answered = false;
  options.forEach(function (option) {
    const button = createElement("button", "option-button", option.text);

    // In debug mode, mark the correct answer.
    if (CONFIG.DEBUG_MODE && option.originalIndex === questionData.correctIndex) {
      button.classList.add("debug-correct");
      button.textContent = option.text + "  ✓";
    }

    // On click, pass the original index, not the display index.
    button.addEventListener("click", function () {
      if (answered) {
        return;
      }
      answered = true;

      // Positive vs final feedback, computed via the original index (never the display index).
      const isCorrect = option.originalIndex === questionData.correctIndex;
      button.classList.add("clicked");
      button.classList.add(isCorrect ? "answer-correct-flash" : "answer-wrong-flash");
      // Lock the panel so the player feels the click before the screen changes.
      optionsBox.classList.add("locked");

      setTimeout(function () {
        answerCurrentIsland(option.originalIndex);
      }, CONFIG.ANSWER_FEEDBACK_MS);
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
function renderLoseScreen(questionData, reachedQuestion, totalQuestions, chosenIndex, difficulty) {
  const root = clearScreen();
  setScreenBackground(questionData.loseImage, CONFIG.USE_IMAGE_ASSETS);
  const screen = createElement("section", "screen lose-screen fade-in");

  screen.appendChild(createElement("div", "big-emoji", "💀"));
  screen.appendChild(createElement("h2", "title", questionData.failTitle));
  screen.appendChild(createElement("p", "subtitle", questionData.failText));

  // Answer review: the player's wrong choice (if known) and the correct answer.
  const review = createElement("div", "answer-review");
  if (typeof chosenIndex === "number" && questionData.options[chosenIndex] !== undefined) {
    const wrongRow = createElement("p", "answer-row answer-wrong");
    wrongRow.appendChild(createElement("span", "answer-label", "בחרת:"));
    wrongRow.appendChild(createElement("span", "answer-value", questionData.options[chosenIndex]));
    review.appendChild(wrongRow);
  }
  // The correct answer is shown only when enabled (a balancing/playtest option).
  if (CONFIG.SHOW_CORRECT_ANSWER_ON_LOSS) {
    const correctRow = createElement("p", "answer-row answer-correct");
    correctRow.appendChild(createElement("span", "answer-label", "התשובה הנכונה:"));
    correctRow.appendChild(
      createElement("span", "answer-value", questionData.options[questionData.correctIndex])
    );
    review.appendChild(correctRow);
  }
  screen.appendChild(review);

  screen.appendChild(
    createElement(
      "p",
      "progress",
      "הגעת לשאלה " + reachedQuestion + " מתוך " + totalQuestions
    )
  );

  // Correct answers before failing (never negative).
  const rememberedClues = Math.max(0, reachedQuestion - 1);
  screen.appendChild(
    createElement("p", "progress-detail", "ענית נכון על " + rememberedClues + " שאלות")
  );

  screen.appendChild(buildPlaytestSummary(rememberedClues, totalQuestions, difficulty));

  const again = createElement("button", "main-button", "שחקו שוב");
  again.addEventListener("click", function () {
    startGame();
  });
  screen.appendChild(again);

  root.appendChild(screen);
}

// ---- Win screen ----
function renderWinScreen(totalQuestions, difficulty) {
  const root = clearScreen();
  setScreenBackground(CONFIG.VICTORY_IMAGE);
  const screen = createElement("section", "screen win-screen fade-in");

  // Simple CSS-only celebration: a few falling confetti pieces behind the content.
  const confetti = createElement("div", "confetti");
  confetti.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 12; i++) {
    confetti.appendChild(createElement("span", "confetti-piece"));
  }
  screen.appendChild(confetti);

  // The trophy gets a celebratory pop/bounce (stronger than a normal success).
  screen.appendChild(createElement("div", "big-emoji trophy-celebrate", "🏆"));
  screen.appendChild(createElement("h2", "title", "מצאת את האוצר!"));
  screen.appendChild(
    createElement(
      "p",
      "subtitle",
      "עברת את כל " + totalQuestions + " השאלות בזכות זיכרון מצוין!"
    )
  );
  screen.appendChild(
    createElement("p", "score", "ניקוד: " + totalQuestions + " מתוך " + totalQuestions)
  );

  screen.appendChild(buildPlaytestSummary(totalQuestions, totalQuestions, difficulty));

  const again = createElement("button", "main-button", "שחקו שוב");
  again.addEventListener("click", function () {
    startGame();
  });
  screen.appendChild(again);

  root.appendChild(screen);
}

// Lightweight playtest/balancing summary shown on the win and lose screens.
// Always shows progress and map time; the hint-label and debug-mode lines are shown
// in DEBUG_MODE only. Reports the settings used this run so testers can judge difficulty.
// No data is stored.
function buildPlaytestSummary(completedQuestions, totalQuestions, difficulty) {
  const box = createElement("div", "playtest-summary");
  const seconds = Math.round(CONFIG.MAP_VIEW_TIME_MS / 1000);
  const difficultyLabel = difficulty ? difficulty.label : CONFIG.DIFFICULTY_LEVELS[CONFIG.DEFAULT_DIFFICULTY].label;
  function yesNo(value) {
    return value ? "כן" : "לא";
  }
  box.appendChild(
    createElement("p", "playtest-line", "השלמת " + completedQuestions + " מתוך " + totalQuestions + " שאלות")
  );
  box.appendChild(createElement("p", "playtest-line", "רמה: " + difficultyLabel));
  box.appendChild(createElement("p", "playtest-line", "זמן צפייה במפה: " + seconds + " שניות"));

  // These extra balancing details are shown only in debug mode.
  if (CONFIG.DEBUG_MODE) {
    box.appendChild(createElement("p", "playtest-line", "מצב פיתוח: " + yesNo(CONFIG.DEBUG_MODE)));
  }
  return box;
}

// Runs a callback when an element's own animation ends, with a fallback timeout if no event fires.
// Ignores animationend events that bubble up from child elements (e.g. the map timer bar),
// so the callback is not triggered early by an unrelated child animation.
function runAfterAnimation(element, callback, fallbackMs) {
  let done = false;
  function finish(event) {
    if (event && event.target !== element) {
      return;
    }
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
