function explainDecision(results) {
  const weights = {};
  results.forEach(r => {
    weights[r.group] = (weights[r.group] || 0) + 1;
  });

  const dominantFactor = Object.keys(weights).sort(
    (a, b) => weights[b] - weights[a]
  )[0];

  return {
    engine_weights: weights,
    dominant_factor: dominantFactor
  };
}

module.exports = explainDecision;
