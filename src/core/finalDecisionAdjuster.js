// src/core/finalDecisionAdjuster.js

function adjustAction(baseAction, confidence, failRatio) {
  if (failRatio > 0.4) return "PAUSE";
  if (confidence > 0.8 && failRatio < 0.1) return "SCALE";
  return baseAction;
}

module.exports = adjustAction;
