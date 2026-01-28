function calibrateConfidence(confidence, historyCount, failRatio) {
  let adjusted = confidence;

  if (historyCount > 5) adjusted += 0.1;
  if (failRatio > 0.3) adjusted -= 0.2;

  return Math.max(0, Math.min(1, adjusted));
}

module.exports = calibrateConfidence;
