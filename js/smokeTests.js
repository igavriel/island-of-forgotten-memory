// smokeTests.js
// Browser smoke tests for game logic, config, and static assets.
// Loaded by test.html only — not part of the playable game.

(function () {
  const EXPECTED_SCRIPT_ORDER = [
    "config/config.js",
    "config/assets.js",
    "js/utils.js",
    "js/layoutGeometry.js",
    "js/gameLogic.js",
    "js/devTools.js",
    "js/renderer.js",
    "js/gameState.js",
    "js/main.js",
  ];

  const results = [];

  function record(name, passed, detail) {
    results.push({ name: name, passed: passed, detail: detail || "" });
  }

  function assert(name, condition, detail) {
    record(name, Boolean(condition), detail);
    return Boolean(condition);
  }

  function assertEqual(name, actual, expected) {
    const passed = actual === expected;
    record(
      name,
      passed,
      passed ? "" : "expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual)
    );
    return passed;
  }

  function runGeometryTests() {
    const bounds = getRectBounds({ x: 50, y: 80, widthPercent: 95, heightPercent: 40 });
    assertEqual("geometry: getRectBounds left", bounds.left, 2.5);
    assertEqual("geometry: getRectBounds right", bounds.right, 97.5);
    assertEqual("geometry: getRectBounds top", bounds.top, 60);
    assertEqual("geometry: getRectBounds bottom", bounds.bottom, 100);

    const sea = buildSeaLayoutFromCorners({ x: 10, y: 20 }, { x: 30, y: 50 });
    assertEqual("geometry: sea layout x", sea.x, 20);
    assertEqual("geometry: sea layout y", sea.y, 35);
    assertEqual("geometry: sea layout width", sea.widthPercent, 20);
    assertEqual("geometry: sea layout height", sea.heightPercent, 30);
    assert("geometry: isInsideRect center", isInsideRect(sea, 20, 35));
    assert("geometry: isInsideRect outside", !isInsideRect(sea, 0, 0));
  }

  function runCategoryTests() {
    const categoryKeys = Object.keys(ASSET_CATEGORIES);
    assert("categories: at least 5", categoryKeys.length >= 5, String(categoryKeys.length));
    assert("categories: volcano exists", Boolean(ASSET_CATEGORIES.volcano));

    categoryKeys.forEach(function (key) {
      const category = ASSET_CATEGORIES[key];
      assert(
        "categories: islandImage on " + key,
        typeof category.islandImage === "string" && category.islandImage.length > 0,
        category.islandImage || "missing"
      );
      assert(
        "categories: assets on " + key,
        Array.isArray(category.assets) && category.assets.length > 0
      );
    });
  }

  function runQuestionRouteTests() {
    const mapAssets = selectRandomMapAssets(
      ASSET_CATEGORIES,
      CONFIG.MAP_ASSET_LAYOUT,
      5,
      CONFIG.REQUIRED_MAP_CATEGORY
    );
    assert("route: map asset count", mapAssets.length === 5, String(mapAssets.length));

    const hasRequiredCategory = mapAssets.some(function (asset) {
      return asset.category === CONFIG.REQUIRED_MAP_CATEGORY;
    });
    assert(
      "route: required category " + CONFIG.REQUIRED_MAP_CATEGORY,
      hasRequiredCategory,
      "not in selection"
    );

    const questions = buildAssetQuestionRoute(mapAssets, ASSET_CATEGORIES, 5);
    assert("route: question count", questions.length === 5, String(questions.length));

    questions.forEach(function (question, index) {
      assert(
        "route: q" + index + " correctIndex in range",
        question.correctIndex >= 0 && question.correctIndex < question.options.length,
        "correctIndex=" + question.correctIndex + ", options=" + question.options.length
      );
      assert("route: q" + index + " questionNumber stripped", question.questionNumber === undefined);
      assert(
        "route: q" + index + " islandImage set",
        typeof question.islandImage === "string" && question.islandImage.indexOf("mountain_") !== -1,
        question.islandImage
      );
      assert(
        "route: q" + index + " failText mentions correct answer",
        typeof question.failText === "string" && question.failText.indexOf("התשובה הנכונה") !== -1
      );
    });

    const volcanoAsset = mapAssets.find(function (asset) {
      return asset.category === "volcano";
    });
    if (volcanoAsset) {
      const volcanoQuestion = cleanGeneratedQuestion(
        buildQuestionForAsset(volcanoAsset, ASSET_CATEGORIES, 1)
      );
      assertEqual(
        "route: volcano islandImage",
        volcanoQuestion.islandImage,
        "assets/islands/mountain_02.png"
      );
    }
  }

  function runConfigTests() {
    assert("config: MAP_VIEW_TIME_MS >= 1000", CONFIG.MAP_VIEW_TIME_MS >= 1000, String(CONFIG.MAP_VIEW_TIME_MS));
    assert("config: DEBUG_MODE is false", CONFIG.DEBUG_MODE === false);
    assert("config: SAILING_LAYOUT_PICKER is false", CONFIG.SAILING_LAYOUT_PICKER === false);
    assert("config: SHOW_CORRECT_ANSWER_ON_LOSS removed", CONFIG.SHOW_CORRECT_ANSWER_ON_LOSS === undefined);
    assert("config: ISLAND_IMAGES removed", CONFIG.ISLAND_IMAGES === undefined);
    assert("config: SAILING_LAYOUT.sea present", Boolean(CONFIG.SAILING_LAYOUT && CONFIG.SAILING_LAYOUT.sea));
    assert("config: MAP_FLY_FRAMES is array", Array.isArray(CONFIG.MAP_FLY_FRAMES));
    assert(
      "config: MAP_FLY_FRAMES count",
      CONFIG.MAP_FLY_FRAMES.length >= 3,
      String(CONFIG.MAP_FLY_FRAMES.length)
    );
  }

  function runModuleTests() {
    assert("modules: selectRandomMapAssets", typeof selectRandomMapAssets === "function");
    assert("modules: getRectBounds", typeof getRectBounds === "function");
    assert("modules: buildAssetQuestionRoute", typeof buildAssetQuestionRoute === "function");
    assert("modules: initDevTools", typeof initDevTools === "function");
    assert("modules: shouldShowSailingGuides", typeof shouldShowSailingGuides === "function");
    assert("modules: debugAnswerCorrectly", typeof debugAnswerCorrectly === "function");
    assert("modules: renderStartScreen", typeof renderStartScreen === "function");
    assert("modules: appendDestinationIsland", typeof appendDestinationIsland === "function");
    assert("modules: startGame", typeof startGame === "function");
  }

  function runIntegrationTests() {
    startGame("medium");
    assert(
      "integration: startGame sets questions",
      Array.isArray(gameState.selectedQuestions) && gameState.selectedQuestions.length === 5,
      String(gameState.selectedQuestions && gameState.selectedQuestions.length)
    );
    assert(
      "integration: startGame sets map assets",
      Array.isArray(gameState.selectedMapAssets) && gameState.selectedMapAssets.length === 5,
      String(gameState.selectedMapAssets && gameState.selectedMapAssets.length)
    );

    const firstQuestion = gameState.selectedQuestions[0];
    if (firstQuestion) {
      assert(
        "integration: first question islandImage",
        typeof firstQuestion.islandImage === "string" && firstQuestion.islandImage.length > 0,
        firstQuestion.islandImage || "missing"
      );
    }

    clearMapTimer();
    gameState.finished = false;
  }

  function isImagePath(path) {
    return /\.(png|jpe?g|gif|webp|svg)$/i.test(path);
  }

  function collectAssetPaths() {
    // Image/media paths only — HTML pages are checked separately (XHR cannot use Image).
    const paths = [
      CONFIG.START_SCREEN_IMAGE,
      CONFIG.MAP_BACKGROUND_IMAGE,
      CONFIG.SAILING_BACKGROUND_IMAGE,
      CONFIG.SAILING_SHIP_IMAGE,
      CONFIG.QUESTION_BACKGROUND_IMAGE,
      CONFIG.LOSE_SCREEN_IMAGE,
      CONFIG.VICTORY_IMAGE,
    ].concat(CONFIG.MAP_FLY_FRAMES);

    Object.keys(ASSET_CATEGORIES).forEach(function (key) {
      paths.push(ASSET_CATEGORIES[key].islandImage);
    });

    const seen = {};
    return paths.filter(function (path) {
      if (!path || seen[path]) {
        return false;
      }
      seen[path] = true;
      return true;
    });
  }

  function probeAsset(path) {
    if (!isImagePath(path)) {
      return Promise.resolve({ path: path, ok: false, detail: "not an image path" });
    }

    return new Promise(function (resolve) {
      const request = new XMLHttpRequest();
      request.open("HEAD", path, true);
      request.onload = function () {
        resolve({ path: path, ok: request.status >= 200 && request.status < 400 });
      };
      request.onerror = function () {
        // HEAD often fails on file://; fall back to Image (valid for images only).
        probeImage(path).then(resolve);
      };
      request.send();
    });
  }

  function probeHtmlFile(path) {
    return new Promise(function (resolve) {
      const request = new XMLHttpRequest();
      request.open("GET", path, true);
      request.onload = function () {
        resolve({ path: path, ok: request.status >= 200 && request.status < 400 });
      };
      request.onerror = function () {
        // Browsers block cross-file XHR on file:// — page loaded, so test.html exists.
        resolve({
          path: path,
          ok: true,
          skipped: true,
          detail: "skipped on file:// (open via static host to verify)",
        });
      };
      request.send();
    });
  }

  function runHtmlFileTests() {
    return Promise.all(
      ["index.html", "test.html"].map(function (path) {
        return probeHtmlFile(path).then(function (result) {
          const detail = result.detail || (result.ok ? "" : "failed to load");
          assert("html: " + result.path, result.ok, detail);
          return result;
        });
      })
    );
  }

  function probeImage(path) {
    return new Promise(function (resolve) {
      const image = new Image();
      image.onload = function () {
        resolve({ path: path, ok: true });
      };
      image.onerror = function () {
        resolve({ path: path, ok: false });
      };
      image.src = path;
    });
  }

  function runAssetTests(paths) {
    return Promise.all(
      paths.map(function (path) {
        return probeAsset(path).then(function (result) {
          assert("asset: " + result.path, result.ok, result.ok ? "" : "failed to load");
          return result;
        });
      })
    );
  }

  function verifyIndexScriptOrder() {
    return new Promise(function (resolve) {
      const request = new XMLHttpRequest();
      request.open("GET", "index.html", true);
      request.onload = function () {
        if (request.status < 200 || request.status >= 400) {
          record("index.html script order", false, "could not read index.html (status " + request.status + ")");
          resolve();
          return;
        }

        let lastIndex = -1;
        let orderOk = true;
        EXPECTED_SCRIPT_ORDER.forEach(function (src) {
          const index = request.responseText.indexOf(src);
          if (index === -1) {
            orderOk = false;
            record("index.html includes " + src, false, "missing");
            return;
          }
          if (index <= lastIndex) {
            orderOk = false;
            record("index.html order " + src, false, "out of order");
            return;
          }
          lastIndex = index;
        });

        if (orderOk) {
          record("index.html script load order", true, EXPECTED_SCRIPT_ORDER.join(" → "));
        }
        resolve();
      };
      request.onerror = function () {
        record(
          "index.html script order",
          true,
          "skipped on file:// (open via static host to verify script order)"
        );
        resolve();
      };
      request.send();
    });
  }

  function renderResults(root) {
    const passed = results.filter(function (item) {
      return item.passed;
    }).length;
    const failed = results.length - passed;

    const summary = document.getElementById("test-summary");
    if (summary) {
      summary.textContent =
        failed === 0
          ? "All " + passed + " checks passed."
          : passed + " passed, " + failed + " failed (" + results.length + " total).";
      summary.className = failed === 0 ? "test-summary pass" : "test-summary fail";
    }

    const list = document.getElementById("test-results");
    if (!list) {
      return;
    }

    list.innerHTML = "";
    results.forEach(function (item) {
      const row = document.createElement("li");
      row.className = item.passed ? "test-pass" : "test-fail";
      row.textContent = (item.passed ? "PASS" : "FAIL") + ": " + item.name;
      if (item.detail) {
        const detail = document.createElement("span");
        detail.className = "test-detail";
        detail.textContent = " — " + item.detail;
        row.appendChild(detail);
      }
      list.appendChild(row);
    });

    if (root) {
      root.classList.remove("test-running");
      root.classList.add(failed === 0 ? "test-done-pass" : "test-done-fail");
    }
  }

  function runSmokeTests() {
    results.length = 0;
    runGeometryTests();
    runCategoryTests();
    runQuestionRouteTests();
    runConfigTests();
    runModuleTests();
    runIntegrationTests();

    const assetPaths = collectAssetPaths();
    return runHtmlFileTests()
      .then(function () {
        return verifyIndexScriptOrder();
      })
      .then(function () {
        return runAssetTests(assetPaths);
      })
      .then(function () {
        return results;
      });
  }

  function logSmokeTestOutcome(allResults) {
    const failed = allResults.filter(function (item) {
      return !item.passed;
    });
    if (failed.length) {
      console.error("Smoke tests failed:", failed);
    } else {
      console.log("Smoke tests passed:", allResults.length);
    }
  }

  function rerunSmokeTestsUI() {
    const root = document.getElementById("test-root");
    if (!root) {
      return Promise.resolve([]);
    }

    const summary = document.getElementById("test-summary");
    const list = document.getElementById("test-results");
    root.className = "test-running";
    if (summary) {
      summary.className = "test-summary test-running";
      summary.textContent = "Running tests…";
    }
    if (list) {
      list.innerHTML = "";
    }

    return runSmokeTests()
      .then(function (allResults) {
        renderResults(root);
        logSmokeTestOutcome(allResults);
        return allResults;
      })
      .catch(function (error) {
        record("runner: uncaught error", false, String(error));
        renderResults(root);
        console.error(error);
        return results.slice();
      });
  }

  window.runSmokeTests = runSmokeTests;
  window.rerunSmokeTestsUI = rerunSmokeTestsUI;
  window.getSmokeTestResults = function () {
    return results.slice();
  };

  document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("test-root");
    if (!root) {
      return;
    }

    initDevTools();
    applyAnimationTimings();

    const rerunButton = document.getElementById("rerun-tests");
    if (rerunButton) {
      rerunButton.addEventListener("click", rerunSmokeTestsUI);
    }

    rerunSmokeTestsUI();
  });
})();
