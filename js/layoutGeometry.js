// layoutGeometry.js
// Percent-based rect/circle math for layout and hit testing. No game flow.

function formatLayoutPercent(value) {
  return Math.round(value * 10) / 10;
}

function buildSeaLayoutFromCorners(cornerA, cornerB) {
  const left = Math.min(cornerA.x, cornerB.x);
  const right = Math.max(cornerA.x, cornerB.x);
  const top = Math.min(cornerA.y, cornerB.y);
  const bottom = Math.max(cornerA.y, cornerB.y);
  return {
    x: formatLayoutPercent((left + right) / 2),
    y: formatLayoutPercent((top + bottom) / 2),
    widthPercent: formatLayoutPercent(right - left),
    heightPercent: formatLayoutPercent(bottom - top),
  };
}

function getRectBounds(layout) {
  return {
    left: layout.x - layout.widthPercent / 2,
    right: layout.x + layout.widthPercent / 2,
    top: layout.y - layout.heightPercent / 2,
    bottom: layout.y + layout.heightPercent / 2,
  };
}

function isInsideRect(layout, xPercent, yPercent) {
  const bounds = getRectBounds(layout);
  return (
    xPercent >= bounds.left &&
    xPercent <= bounds.right &&
    yPercent >= bounds.top &&
    yPercent <= bounds.bottom
  );
}

function clampPointToRect(layout, xPercent, yPercent) {
  const bounds = getRectBounds(layout);
  return {
    x: Math.min(bounds.right, Math.max(bounds.left, xPercent)),
    y: Math.min(bounds.bottom, Math.max(bounds.top, yPercent)),
  };
}

function getScenePercentFromEvent(scene, event) {
  const rect = scene.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100,
  };
}
