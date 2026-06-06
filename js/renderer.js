// renderer.js
// DOM rendering only. Holds no game state and decides no flow.
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
  root.style.setProperty("--sailing-ship-travel-ms", CONFIG.SAILING_SHIP_TRAVEL_MS + "ms");
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
// If the image fails to load (missing/renamed file), the placeholder is swapped back in,
// so the game never shows a broken image.
// altText: meaningful description for informative images (e.g. a hint label),
//          or "" for decorative images.
function appendVisual(parent, src, placeholderEl, className, altText) {
  if (src) {
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
function setScreenBackground(src) {
  const layer = document.getElementById("screen-bg");
  if (!layer) {
    return;
  }
  function clear() {
    layer.style.backgroundImage = "";
    layer.style.backgroundSize = "";
    layer.style.backgroundPosition = "";
    layer.style.backgroundRepeat = "";
    layer.classList.remove("is-visible");
  }
  if (src) {
    const probe = new Image();
    probe.onload = function () {
      layer.style.backgroundImage = "url('" + src + "')";
      layer.style.backgroundSize = "cover";
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
  const mapTitle = createElement("h2", "map-title", "מפת האוצר - זכרו את הרמזים!");
  mapHeader.appendChild(mapTitle);
  mapCard.appendChild(mapHeader);

  mapCard.appendChild(renderMapAssets(selectedMapAssets || []));

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
  preloadMapFlyFrames(CONFIG.MAP_FLY_FRAMES);
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

// Sprite-style map fly-away: plays CONFIG.MAP_FLY_FRAMES one after another, then calls
// the callback. A short Hebrew message appears while the map flies off. The map is never
// re-rendered, so the player cannot reopen it.
function renderMapBlowAway(callback) {
  const mapCard = document.querySelector(".map-card");
  const screen = mapCard ? mapCard.closest(".screen") : null;
  if (!mapCard || !screen) {
    callback();
    return;
  }

  screen.classList.add("is-map-flying");
  mapCard.className = "map-fly-sequence";
  mapCard.innerHTML = "";

  const flyImage = createElement("img", "map-fly-frame");
  flyImage.alt = "";
  mapCard.appendChild(flyImage);

  const message = createElement("div", "wind-message", "💨 הרוח העיפה את המפה! אי אפשר לפתוח אותה שוב");
  screen.appendChild(message);

  playMapFlyFrames(
    flyImage,
    CONFIG.MAP_FLY_FRAMES || [],
    CONFIG.MAP_FLY_FRAME_MS || 370,
    callback
  );
}

// Preloads fly frames during the map viewing phase so frame swaps do not flicker.
function preloadMapFlyFrames(frames) {
  if (!frames || !frames.length) {
    return;
  }
  frames.forEach(function (src) {
    const probe = new Image();
    probe.src = src;
  });
}

// Shows each fly frame in order like a short sprite movie, then runs the callback.
function playMapFlyFrames(imageElement, frames, frameMs, callback) {
  if (!frames.length) {
    callback();
    return;
  }

  let frameIndex = 0;
  imageElement.src = frames[0];

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    imageElement.src = frames[frames.length - 1];
    setTimeout(callback, 200);
    return;
  }

  function showNext() {
    frameIndex += 1;
    if (frameIndex >= frames.length) {
      callback();
      return;
    }
    imageElement.src = frames[frameIndex];
    setTimeout(showNext, frameMs);
  }

  setTimeout(showNext, frameMs);
}

// ---- Sailing-between-islands screen (point-and-click) ----

function getSailingLayout() {
  return (
    CONFIG.SAILING_LAYOUT || {
      sea: { x: 50, y: 68, widthPercent: 92, heightPercent: 55 },
      island: { x: 18, y: 72, sizePercent: 30 },
      ship: { x: 82, y: 65, sizePercent: 18 },
      dock: { x: 34, y: 65, sizePercent: 18 },
    }
  );
}

// Positions a rectangle by center (x/y %) and width/height as % of the scene.
function applyRectLayout(el, layout) {
  el.style.left = layout.x + "%";
  el.style.top = layout.y + "%";
  el.style.width = layout.widthPercent + "%";
  el.style.height = layout.heightPercent + "%";
  el.style.transform = "translate(-50%, -50%)";
}

// Positions a circle by center (x/y %) and diameter (sizePercent of scene width).
// Image slots use the circle as a size anchor but allow the art to extend beyond it.
function applyCircleLayout(el, layout, imageSlot) {
  el.style.left = layout.x + "%";
  el.style.top = layout.y + "%";
  el.style.width = layout.sizePercent + "%";
  el.style.transform = "translate(-50%, -50%)";
  if (imageSlot) {
    el.style.height = "auto";
    el.style.overflow = "visible";
  } else {
    el.style.aspectRatio = "1";
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function sailShipTo(shipEl, x, y, travelMs, onComplete) {
  if (prefersReducedMotion()) {
    shipEl.style.transition = "none";
    shipEl.style.left = x + "%";
    shipEl.style.top = y + "%";
    if (onComplete) {
      onComplete();
    }
    return;
  }

  shipEl.style.transition =
    "left " + travelMs + "ms ease-out, top " + travelMs + "ms ease-out";
  shipEl.offsetHeight;
  shipEl.style.left = x + "%";
  shipEl.style.top = y + "%";

  let done = false;
  function finish() {
    if (done) {
      return;
    }
    done = true;
    shipEl.removeEventListener("transitionend", finish);
    if (onComplete) {
      onComplete();
    }
  }
  shipEl.addEventListener("transitionend", finish);
  setTimeout(finish, travelMs + 80);
}

function renderSailing(questionNumber, totalQuestions, callback) {
  const root = clearScreen();
  setScreenBackground(CONFIG.SAILING_BACKGROUND_IMAGE);
  const screen = createElement("section", "screen sailing-screen fade-in");
  const layoutPicker = isSailingLayoutPickerActive();
  const scene = createElement("div", "sailing-scene" + getSailingScenePickerClass());
  const layout = getSailingLayout();
  const travelMs = CONFIG.SAILING_SHIP_TRAVEL_MS || 1200;
  let isMoving = false;

  if (shouldShowSailingGuides()) {
    appendSailingLayoutGuides(scene, layout);
  }

  const seaHitbox = createElement("div", "sailing-rect sailing-sea-hitbox");
  applyRectLayout(seaHitbox, layout.sea);
  scene.appendChild(seaHitbox);

  const islandWrap = createElement("div", "sailing-circle destination-island sailing-image-slot");
  applyCircleLayout(islandWrap, layout.island, true);
  const islandPlaceholder = createElement("span", "sailing-circle-fill destination-island-emoji", "🏝️");
  appendVisual(
    islandWrap,
    CONFIG.SAILING_DESTINATION_ISLAND_IMAGE,
    islandPlaceholder,
    "sailing-circle-fill destination-island-img",
    ""
  );
  scene.appendChild(islandWrap);

  const shipWrap = createElement("div", "sailing-circle sailing-ship sailing-image-slot");
  applyCircleLayout(shipWrap, layout.ship, true);
  const shipPlaceholder = createElement("span", "sailing-circle-fill sailing-ship-emoji", "⛵");
  appendVisual(
    shipWrap,
    CONFIG.SAILING_SHIP_IMAGE,
    shipPlaceholder,
    "sailing-circle-fill sailing-ship-img",
    ""
  );
  scene.appendChild(shipWrap);

  if (!layoutPicker) {
    seaHitbox.addEventListener("click", function (event) {
      if (isMoving) {
        return;
      }
      const point = getScenePercentFromEvent(scene, event);
      if (!isInsideRect(layout.sea, point.x, point.y)) {
        return;
      }
      const target = clampPointToRect(layout.sea, point.x, point.y);
      isMoving = true;
      sailShipTo(shipWrap, target.x, target.y, travelMs, function () {
        isMoving = false;
      });
    });

    islandWrap.addEventListener("click", function (event) {
      event.stopPropagation();
      if (isMoving) {
        return;
      }
      isMoving = true;
      sailShipTo(shipWrap, layout.dock.x, layout.dock.y, travelMs, callback);
    });
  }

  screen.appendChild(scene);

  if (!appendSailingPickerUI(screen, scene, layout)) {
    screen.appendChild(
      createElement("p", "sailing-message", "לחצו על הים כדי לשוט, ועל האי כדי לעגון")
    );
  }
  screen.appendChild(
    createElement(
      "p",
      "sailing-progress",
      "שאלה " + questionNumber + " מתוך " + totalQuestions
    )
  );
  root.appendChild(screen);
}

// ---- Island question screen ----
function renderIsland(questionData, questionIndex, totalQuestions) {
  const root = clearScreen();
  setScreenBackground(CONFIG.SAILING_BACKGROUND_IMAGE);
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

    decorateDebugOptionButton(button, option, questionData);

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

  appendIslandDebugPanel(screen);

  root.appendChild(screen);
}

// ---- Lose screen ----
// chosenIndex is the original index of the wrong answer the player picked (may be undefined).
function renderLoseScreen(questionData, reachedQuestion, totalQuestions, chosenIndex, difficulty) {
  const root = clearScreen();
  setScreenBackground(CONFIG.LOSE_SCREEN_IMAGE);
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

  const again = createElement("button", "main-button", "לתפריט הראשי");
  again.addEventListener("click", function () {
    showStartScreen();
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

  const again = createElement("button", "main-button", "לתפריט הראשי");
  again.addEventListener("click", function () {
    showStartScreen();
  });
  screen.appendChild(again);

  root.appendChild(screen);
}

// Playtest/balancing summary on win and lose screens (progress, level, map time).
function buildPlaytestSummary(completedQuestions, totalQuestions, difficulty) {
  const box = createElement("div", "playtest-summary");
  const seconds = Math.round(CONFIG.MAP_VIEW_TIME_MS / 1000);
  const difficultyLabel = difficulty ? difficulty.label : CONFIG.DIFFICULTY_LEVELS[CONFIG.DEFAULT_DIFFICULTY].label;
  box.appendChild(
    createElement("p", "playtest-line", "השלמת " + completedQuestions + " מתוך " + totalQuestions + " שאלות")
  );
  box.appendChild(createElement("p", "playtest-line", "רמה: " + difficultyLabel));
  box.appendChild(createElement("p", "playtest-line", "זמן צפייה במפה: " + seconds + " שניות"));
  appendPlaytestDebugLines(box);
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
