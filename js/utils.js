// utils.js
// General helper functions. No game logic here and no dependency on riddle content.

// Fisher-Yates shuffle. Returns a new shuffled array without mutating the original.
function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap element i with element j
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

// Randomly picks "count" items from an array, without repeats.
// Used to select the island route from the riddle pool.
function pickRandom(array, count) {
  const safeCount = clamp(count, 0, array.length);
  return shuffle(array).slice(0, safeCount);
}

// Clamps a number to the range [min, max].
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Builds an options list that preserves the original index, then shuffles the display.
// Each item: { text, originalIndex }
// This lets us shuffle the answer buttons without losing which answer is correct.
function buildShuffledOptions(options) {
  const withIndex = options.map(function (text, originalIndex) {
    return { text: text, originalIndex: originalIndex };
  });
  return shuffle(withIndex);
}
