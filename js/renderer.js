// renderer.js
// Responsible for all DOM rendering. Holds no game state and decides no flow.
// The flow functions (gameState.js) call the render* functions here.

// The root element into which all screens are injected.
function getRoot() {
  return document.getElementById("game");
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
  // The pulsing cue makes the memory phase feel intentional: "memorize this now".
  mapCard.appendChild(
    createElement("p", "map-subtitle memorize-cue", "זכרו את הרמזים לפי הסדר!")
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
  mapCard.appendChild(timerBar);

  screen.appendChild(mapCard);
  root.appendChild(screen);
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
  setTimeout(callback, CONFIG.SAILING_TRANSITION_MS);
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

  // The character card gets a small entrance animation so the island "arrives" clearly.
  const character = createElement("div", "character-box character-enter");
  // Character image if available, otherwise the emoji placeholder. Named by characterName for alt.
  const characterPlaceholder = createElement("div", "character-emoji", "🧑‍✈️");
  appendVisual(character, riddle.characterImage, characterPlaceholder, "character-image", riddle.characterName);
  character.appendChild(createElement("p", "character-name", riddle.characterName));
  character.appendChild(createElement("p", "question", riddle.question));
  screen.appendChild(character);

  // Build options preserving the original index, then shuffle the display.
  const options = buildShuffledOptions(riddle.options);
  const optionsBox = createElement("div", "options");

  // Guard so only the first click counts during the short feedback moment.
  let answered = false;
  options.forEach(function (option) {
    const button = createElement("button", "option-button", option.text);

    // In debug mode, mark the correct answer.
    if (CONFIG.DEBUG_MODE && option.originalIndex === riddle.correctIndex) {
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
      const isCorrect = option.originalIndex === riddle.correctIndex;
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
  // The correct answer is shown only when enabled (a balancing/playtest option).
  if (CONFIG.SHOW_CORRECT_ANSWER_ON_LOSS) {
    const correctRow = createElement("p", "answer-row answer-correct");
    correctRow.appendChild(createElement("span", "answer-label", "התשובה הנכונה:"));
    correctRow.appendChild(
      createElement("span", "answer-value", riddle.options[riddle.correctIndex])
    );
    review.appendChild(correctRow);
  }
  screen.appendChild(review);

  screen.appendChild(
    createElement(
      "p",
      "progress",
      "הגעת לאי " + reachedIsland + " מתוך " + totalIslands
    )
  );

  // Clues remembered correctly = islands cleared before failing (never negative).
  const rememberedClues = Math.max(0, reachedIsland - 1);
  screen.appendChild(
    createElement("p", "progress-detail", "זכרת נכון " + rememberedClues + " רמזים")
  );

  screen.appendChild(buildPlaytestSummary(rememberedClues, totalIslands));

  const again = createElement("button", "main-button", "שחקו שוב");
  again.addEventListener("click", startGame);
  screen.appendChild(again);

  root.appendChild(screen);
}

// ---- Win screen ----
function renderWinScreen(totalIslands) {
  const root = clearScreen();
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
      "עברת את כל " + totalIslands + " האיים בזכות זיכרון מצוין!"
    )
  );
  screen.appendChild(
    createElement("p", "score", "ניקוד: " + totalIslands + " מתוך " + totalIslands)
  );

  screen.appendChild(buildPlaytestSummary(totalIslands, totalIslands));

  const again = createElement("button", "main-button", "שחקו שוב");
  again.addEventListener("click", startGame);
  screen.appendChild(again);

  root.appendChild(screen);
}

// Lightweight playtest/balancing summary shown on the win and lose screens.
// Always shows progress and map time; the hint-label and debug-mode lines are shown
// in DEBUG_MODE only. Reports the settings used this run so testers can judge difficulty.
// No data is stored.
function buildPlaytestSummary(completedIslands, totalIslands) {
  const box = createElement("div", "playtest-summary");
  const seconds = Math.round(CONFIG.MAP_VIEW_TIME_MS / 1000);
  function yesNo(value) {
    return value ? "כן" : "לא";
  }
  box.appendChild(
    createElement("p", "playtest-line", "השלמת " + completedIslands + " מתוך " + totalIslands + " איים")
  );
  box.appendChild(createElement("p", "playtest-line", "זמן צפייה במפה: " + seconds + " שניות"));

  // These extra balancing details are shown only in debug mode.
  if (CONFIG.DEBUG_MODE) {
    box.appendChild(
      createElement("p", "playtest-line", "רמזי טקסט הוצגו: " + yesNo(CONFIG.SHOW_HINT_LABELS_ON_MAP))
    );
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
