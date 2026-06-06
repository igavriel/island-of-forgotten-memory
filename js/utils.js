// utils.js
// Generic helpers. No DOM, no game flow, no asset-specific content.

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
function pickRandom(array, count) {
  const safeCount = clamp(count, 0, array.length);
  return shuffle(array).slice(0, safeCount);
}

// Randomly picks one item from an array.
function pickOneRandom(array) {
  if (!array || array.length === 0) {
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
}

// Returns unique values while preserving first-seen order.
function getUniqueValues(values) {
  const seen = {};
  const uniqueValues = [];

  values.forEach(function (value) {
    if (value === undefined || value === null || seen[value]) {
      return;
    }
    seen[value] = true;
    uniqueValues.push(value);
  });

  return uniqueValues;
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
