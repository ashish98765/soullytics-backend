/**
 * adsCode00.dataFusion.js
 * -------------------------------------------------
 * PURPOSE:
 * Fuse raw ad metrics into clean, decision-ready signals.
 * No judgement. No decisions. Only truth + confidence.
 */

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function normalize(value, minIdeal, maxIdeal) {
  if (value === null || value === undefined || isNaN(value)) return 0;
  if (value <= minIdeal) return 0;
  if (value >= maxIdeal) return 1;
  return (value - minIdeal) / (maxIdeal - minIdeal);
}

/**
 * Strength of signal (performance quality)
 */
function signalStrengthEngine({ ctr, cvr, roas }) {
  const ctrScore  = normalize(ctr, 0.5, 3);   // %
  const cvrScore  = normalize(cvr, 0.5, 5);   // %
  const roasScore = normalize(roas, 1, 4);

  return clamp((ctrScore + cvrScore + roasScore) / 3);
}

/**
 * Data unreliability / noise
 */
function noiseEngine({ impressions, daysRunning, volatility }) {
  const volumeScore = normalize(impressions, 1000, 15000);
  const timeScore   = normalize(daysRunning, 3, 10);
  const volPenalty  = volatility ? clamp(volatility) : 0;

  // Less volume + less time + high volatility = more noise
  return clamp(1 - (volumeScore * 0.4 + timeScore * 0.4) + volPenalty * 0.2);
}

/**
 * Economic & outcome stability
 */
function stabilityEngine({ cpa, roas }) {
  if (!cpa || cpa <= 0) return 0;

  const efficiencyScore = normalize(1 / cpa, 0.01, 0.05);
  const roasScore       = normalize(roas, 1, 3);

  return clamp((efficiencyScore + roasScore) / 2);
}

/**
 * Learning phase awareness
 */
function learningStageEngine({ daysRunning, impressions }) {
  if (daysRunning < 3 || impressions < 1000) return "COLD_START";
  if (daysRunning < 7 || impressions < 5000) return "LEARNING";
  return "STABLE";
}

/**
 * Human-bias & illusion flags
 */
function biasFlagsEngine({ ctr, cvr, daysRunning, impressions }) {
  return {
    falsePositiveRisk:
      ctr > 2 && cvr < 0.3 && daysRunning < 5,

    vanityMetricTrap:
      ctr > 2.5 && impressions < 2000,

    lowDataRisk:
      impressions < 1000 || daysRunning < 3
  };
}

/**
 * Confidence score (how much to trust outputs)
 */
function confidenceEngine(noise, stability, stage) {
  let base = clamp((stability * 0.6) + ((1 - noise) * 0.4));

  if (stage === "COLD_START") base *= 0.4;
  if (stage === "LEARNING")   base *= 0.7;

  return clamp(base);
}

/**
 * Readiness classification
 */
function readinessClassifier(signal, confidence) {
  if (confidence < 0.4) return "UNRELIABLE";
  if (signal > 0.7 && confidence > 0.7) return "HIGH";
  if (signal > 0.4) return "MEDIUM";
  return "LOW";
}

/**
 * MAIN EXPORT
 */
module.exports = function dataFusionEngine(metrics = {}) {
  const signalStrength = signalStrengthEngine(metrics);
  const noiseLevel     = noiseEngine(metrics);
  const stabilityScore = stabilityEngine(metrics);
  const learningStage  = learningStageEngine(metrics);
  const biasFlags      = biasFlagsEngine(metrics);
  const confidence     = confidenceEngine(
    noiseLevel,
    stabilityScore,
    learningStage
  );

  return {
    // Core fused signals
    signalStrength,
    noiseLevel,
    stabilityScore,
    confidence,

    // Contextual truth
    learningStage,
    biasFlags,

    // Final readiness (used by decision engine)
    dataReadiness: readinessClassifier(signalStrength, confidence)
  };
};
