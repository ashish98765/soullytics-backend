function analyzeTemporal(previous, current) {
  if (!previous) {
    return {
      trend: "NO_HISTORY",
      note: "First decision for this context"
    };
  }

  const riskDelta = current.risk - previous.risk;
  const confidenceDelta = current.confidence - previous.confidence;

  let trend = "STABLE";

  if (riskDelta > 0.15) trend = "RISK_INCREASING";
  if (riskDelta < -0.15) trend = "RISK_DECREASING";

  if (confidenceDelta < -0.2) trend = "CONFIDENCE_DROPPING";

  return {
    trend,
    deltas: {
      risk: Number(riskDelta.toFixed(2)),
      confidence: Number(confidenceDelta.toFixed(2))
    },
    note: `Compared to previous decision`
  };
}

module.exports = { analyzeTemporal };
