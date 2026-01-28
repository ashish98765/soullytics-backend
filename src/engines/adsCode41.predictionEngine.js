const { engineResult } = require("../core/engineResult");

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function trendSlope(values = []) {
  if (values.length < 3) return 0;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  values.forEach((y, x) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });
  const n = values.length;
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return 0;
  return (n * sumXY - sumX * sumY) / denom;
}

function volatility(values = []) {
  if (values.length < 3) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  return clamp(Math.sqrt(variance) / mean);
}

module.exports = function adsCode41(context = {}) {
  const {
    cpaHistory = [],
    roasHistory = [],
    signalStrength = 0,
    noiseLevel = 1,
    stabilityScore = 0,
    daysRunning = 0
  } = context;

  if (daysRunning < 3) {
    return engineResult({
      engine: "AdsCode41_Prediction",
      status: "INSUFFICIENT_DATA",
      impact: "LOW",
      authority: 2,
      score: 0.2,
      message: "Not enough historical data for prediction."
    });
  }

  const cpaBreakProbability = clamp(
    0.4 * trendSlope(cpaHistory) +
    0.4 * volatility(cpaHistory) +
    0.2 * (1 - stabilityScore)
  );

  const roasDecayProbability = clamp(
    0.5 * trendSlope(roasHistory) +
    0.3 * volatility(roasHistory) +
    0.2 * noiseLevel
  );

  const predictionConfidence = clamp(
    signalStrength * (1 - noiseLevel) * stabilityScore
  );

  let risk = "LOW";
  if (cpaBreakProbability > 0.7 || roasDecayProbability > 0.7) risk = "HIGH";
  else if (cpaBreakProbability > 0.45 || roasDecayProbability > 0.45) risk = "MEDIUM";

  return engineResult({
    engine: "AdsCode41_Prediction",
    status: "FORECAST_READY",
    impact: risk,
    authority: 4,
    score: clamp((cpaBreakProbability + roasDecayProbability) / 2),
    message: "Future performance risk forecast generated.",
    forecast: {
      cpaBreakProbability: Number(cpaBreakProbability.toFixed(2)),
      roasDecayProbability: Number(roasDecayProbability.toFixed(2)),
      confidence: Number(predictionConfidence.toFixed(2)),
      horizon: "Next 3–7 days"
    }
  });
};
