module.exports = function buildExplanation({ confidence, risk, metrics }) {
  const lines = [];

  lines.push(`Confidence: ${confidence}`);
  lines.push(`Risk: ${risk}`);

  if (metrics.cpa) {
    lines.push(
      `CPA is ${metrics.cpa}, based on ${metrics.volume} conversions.`
    );
  } else {
    lines.push("Insufficient conversion volume to establish CPA reliability.");
  }

  if (confidence === "High") {
    lines.push("Performance patterns are consistent with low variance.");
  } else {
    lines.push("Performance signals are still stabilizing.");
  }

  return lines.join(" ");
};
