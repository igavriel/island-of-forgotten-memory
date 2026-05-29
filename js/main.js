// main.js
// Entry point: initializes the game after the DOM has loaded.
// All other files are already loaded before this one (see the script order in index.html).

document.addEventListener("DOMContentLoaded", function () {
  // In debug mode, print a reminder to the console. Must be false for the final presentation.
  if (CONFIG.DEBUG_MODE) {
    console.log("DEBUG_MODE is active — turn it off before the final submission.");
  }
  // Sync the configurable transition timings into CSS before the first screen renders.
  applyAnimationTimings();
  showStartScreen();
});
