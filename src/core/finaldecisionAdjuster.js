// src/core/finalDecisionAdjuster.js

function adjustAction(action, confidence, failRatio) {
  // Critical failures
  if (failRatio > 0.4) return "KILL";

  // Low confidence → pause
  if (confidence < 0.4) return "PAUSE";

  // Strong signals → scale
  if (action === "RUN" && confidence >= 0.75 && failRatio <= 0.1) {
    return "SCALE";
  }

  return action;
}

module.exports = adjustAction;
