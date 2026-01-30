function calibrateConfidence({ confidence, risk, temporal }) {
  let calibrated = confidence;

  // Overconfidence dampening
  if (confidence > 0.8 && risk > 0.4) {
    calibrated -= 0.15;
  }

  // Sudden confidence drops are suspicious
  if (temporal?.trend === "CONFIDENCE_DROPPING") {
    calibrated -= 0.1;
  }

  // Risk increasing = confidence penalty
  if (temporal?.trend === "RISK_INCREASING") {
    calibrated -= 0.12;
  }

  // Floor & ceiling
  if (calibrated > 0.9) calibrated = 0.9;
  if (calibrated < 0.1) calibrated = 0.1;

  return Number(calibrated.toFixed(2));
}

module.exports = { calibrateConfidence };
