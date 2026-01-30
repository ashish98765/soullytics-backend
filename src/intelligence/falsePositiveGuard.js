function suppressFalsePositive({ risk, temporal }) {
  // One-time spike protection
  if (
    temporal?.trend === "RISK_INCREASING" &&
    Math.abs(temporal.deltas?.risk) < 0.2
  ) {
    return {
      suppressed: true,
      reason: "Single-period risk spike detected"
    };
  }

  return { suppressed: false };
}

module.exports = { suppressFalsePositive };
