// src/core/confidenceCalibrator.js

function calibrateConfidence(confidence, failRatio) {
  if (failRatio > 0.4) {
    return Math.max(0.2, confidence * 0.6);
  }

  if (failRatio < 0.1 && confidence > 0.7) {
    return Math.min(0.95, confidence + 0.05);
  }

  return confidence;
}

module.exports = calibrateConfidence;
