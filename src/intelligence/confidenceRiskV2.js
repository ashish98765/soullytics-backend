function computeConfidence(metrics, pattern) {
  let confidence = 0.5;

  if (metrics.conversions > 20) confidence += 0.2;
  if (metrics.ctr > 1.5) confidence += 0.1;

  if (pattern !== "NORMAL_PATTERN") {
    confidence -= 0.2;
  }

  return Math.max(0.1, Math.min(confidence, 0.9));
}

function computeRisk(metrics, pattern) {
  let risk = 0.4;

  if (metrics.spend > 1000 && metrics.conversions < 10) {
    risk += 0.3;
  }

  if (pattern !== "NORMAL_PATTERN") {
    risk += 0.2;
  }

  return Math.min(risk, 0.9);
}

module.exports = { computeConfidence, computeRisk };
