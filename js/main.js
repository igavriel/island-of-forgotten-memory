// main.js
// Entry point: initializes the game after the DOM has loaded.
// All other files are already loaded before this one (see the script order in index.html).

document.addEventListener("DOMContentLoaded", function () {
  initDevTools();
  // Sync the configurable transition timings into CSS before the first screen renders.
  applyAnimationTimings();
  showStartScreen();
});
