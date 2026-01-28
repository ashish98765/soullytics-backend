function adjustAction(action, confidence, failRatio) {
  if (failRatio > 0.4) return "PAUSE";
  if (confidence > 0.75 && failRatio < 0.1) return "SCALE";
  return action;
}

module.exports = adjustAction;
