// devTools.js
// Debug mode, layout picker, sailing guides, and playtest dev overlays.
// No production gameplay rules; gated by CONFIG flags.

function createDevElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (text !== undefined && text !== null) {
    el.textContent = text;
  }
  return el;
}

function initDevTools() {
  if (CONFIG.DEBUG_MODE) {
    console.log("DEBUG_MODE is active — turn it off before the final submission.");
  }
}

function isDebugMode() {
  return Boolean(CONFIG.DEBUG_MODE);
}

function shouldShowSailingGuides() {
  return CONFIG.SAILING_SHOW_LAYOUT_GUIDES || CONFIG.SAILING_LAYOUT_PICKER || CONFIG.DEBUG_MODE;
}

function isSailingLayoutPickerActive() {
  return Boolean(CONFIG.SAILING_LAYOUT_PICKER);
}

function getSailingScenePickerClass() {
  return isSailingLayoutPickerActive() ? " sailing-scene--layout-picker" : "";
}

function applyGuideRect(el, layout) {
  el.style.left = layout.x + "%";
  el.style.top = layout.y + "%";
  el.style.width = layout.widthPercent + "%";
  el.style.height = layout.heightPercent + "%";
  el.style.transform = "translate(-50%, -50%)";
}

function applyGuideCircle(el, layout) {
  el.style.left = layout.x + "%";
  el.style.top = layout.y + "%";
  el.style.width = layout.sizePercent + "%";
  el.style.transform = "translate(-50%, -50%)";
  el.style.aspectRatio = "1";
}

function appendSailingLayoutGuides(scene, layout) {
  const seaGuide = createDevElement("div", "sailing-guide sailing-rect-guide sailing-guide-sea");
  applyGuideRect(seaGuide, layout.sea);
  scene.appendChild(seaGuide);

  const islandGuide = createDevElement("div", "sailing-guide sailing-circle-guide sailing-guide-island");
  applyGuideCircle(islandGuide, layout.island);
  scene.appendChild(islandGuide);

  const shipGuide = createDevElement("div", "sailing-guide sailing-circle-guide sailing-guide-ship");
  applyGuideCircle(shipGuide, layout.ship);
  scene.appendChild(shipGuide);

  const dockGuide = createDevElement("div", "sailing-guide sailing-circle-guide sailing-guide-dock");
  applyGuideCircle(dockGuide, layout.dock);
  scene.appendChild(dockGuide);
}

function updateSailingLayoutPickerHud(hud, lines) {
  hud.innerHTML = "";
  lines.forEach(function (line) {
    hud.appendChild(createDevElement("p", "sailing-picker-line", line));
  });
}

function attachSailingLayoutPicker(scene, hud, layout) {
  let seaCorner = null;

  scene.addEventListener("click", function (event) {
    const point = getScenePercentFromEvent(scene, event);
    const x = formatLayoutPercent(point.x);
    const y = formatLayoutPercent(point.y);

    if (event.shiftKey) {
      if (!seaCorner) {
        seaCorner = { x: x, y: y };
        console.log("[SAILING_LAYOUT] Sea corner 1:", seaCorner);
        console.log("Shift+click the opposite sea corner.");
        updateSailingLayoutPickerHud(hud, [
          "Layout picker active",
          "Sea corner 1: x " + x + ", y " + y,
          "Shift+click opposite sea corner",
        ]);
        return;
      }

      const sea = buildSeaLayoutFromCorners(seaCorner, { x: x, y: y });
      seaCorner = null;
      const snippet =
        "sea: { x: " +
        sea.x +
        ", y: " +
        sea.y +
        ", widthPercent: " +
        sea.widthPercent +
        ", heightPercent: " +
        sea.heightPercent +
        " }";
      console.log("[SAILING_LAYOUT] Sea rectangle:", sea);
      console.log("Paste into SAILING_LAYOUT:", snippet);
      updateSailingLayoutPickerHud(hud, [
        "Layout picker active",
        "Sea: x " + sea.x + ", y " + sea.y,
        "width " + sea.widthPercent + "%, height " + sea.heightPercent + "%",
        "Full snippet logged to console (F12)",
      ]);
      return;
    }

    const islandSnippet =
      "island: { x: " + x + ", y: " + y + ", sizePercent: " + layout.island.sizePercent + " }";
    const shipSnippet =
      "ship: { x: " + x + ", y: " + y + ", sizePercent: " + layout.ship.sizePercent + " }";
    const dockSnippet =
      "dock: { x: " + x + ", y: " + y + ", sizePercent: " + layout.dock.sizePercent + " }";

    console.log("[SAILING_LAYOUT] Click point:", { x: x, y: y });
    console.log("Island:", islandSnippet);
    console.log("Ship:  ", shipSnippet);
    console.log("Dock:  ", dockSnippet);

    updateSailingLayoutPickerHud(hud, [
      "Layout picker active — point: x " + x + ", y " + y,
      "Click — center for island / ship / dock (see console)",
      "Shift+click twice — sea rectangle (opposite corners)",
      "Open console: F12 → Console",
    ]);
  });
}

// Returns true when picker UI was added (gameplay clicks should be disabled).
function appendSailingPickerUI(screen, scene, layout) {
  if (!isSailingLayoutPickerActive()) {
    return false;
  }

  const pickerHud = createDevElement("div", "sailing-layout-picker-hud");
  updateSailingLayoutPickerHud(pickerHud, [
    "Layout picker active",
    "Click — center (island / ship / dock) → console",
    "Shift+click ×2 — sea rectangle corners → console",
    "F12 → Console",
  ]);
  screen.appendChild(pickerHud);
  attachSailingLayoutPicker(scene, pickerHud, layout);
  screen.appendChild(
    createDevElement(
      "p",
      "sailing-message sailing-message--picker",
      "Layout picker: click the scene — values in console (F12)"
    )
  );
  return true;
}

function decorateDebugOptionButton(button, option, questionData) {
  if (!isDebugMode()) {
    return;
  }
  if (option.originalIndex === questionData.correctIndex) {
    button.classList.add("debug-correct");
    button.textContent = option.text + "  ✓";
  }
}

function appendIslandDebugPanel(screen) {
  if (!isDebugMode()) {
    return;
  }

  const debugBox = createDevElement("div", "debug-box");
  debugBox.appendChild(
    createDevElement("p", "debug-note", "מצב פיתוח פעיל — התשובה הנכונה מסומנת ב-✓")
  );
  const skipButton = createDevElement("button", "debug-button", "דלג (תשובה נכונה)");
  skipButton.addEventListener("click", debugAnswerCorrectly);
  debugBox.appendChild(skipButton);
  screen.appendChild(debugBox);
}

function appendPlaytestDebugLines(box) {
  if (!isDebugMode()) {
    return;
  }
  box.appendChild(createDevElement("p", "playtest-line", "מצב פיתוח: כן"));
}

function debugAnswerCorrectly() {
  if (!isDebugMode() || gameState.finished) {
    return;
  }
  const currentQuestion = gameState.selectedQuestions[gameState.currentQuestionIndex];
  answerCurrentIsland(currentQuestion.correctIndex);
}
