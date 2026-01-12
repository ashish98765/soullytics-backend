/**
 * adsCode00.dataFusion.js
 * -----------------------------------
 * PURPOSE:
 * Fuse raw ad metrics into clean, decision-ready signals.
 * No judgement. No bias. No decisions.
 */

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function normalize(value, minIdeal, maxIdeal) {
  if (value <= minIdeal) return 0;
  if (value >= maxIdeal) return 1;
  return (value - minIdeal) / (maxIdeal - minIdeal);
}

/**
 * Measures performance signal quality
 */
function signalStrengthEngine({ ctr, cvr, roas }) {
  const ctrScore = normalize(ctr, 0.5, 3);     // %
  const cvrScore = normalize(cvr, 0.5, 5);     // %
  const roasScore = normalize(roas, 1, 4);

  return clamp((ctrScore + cvrScore + roasScore) / 3);
}

/**
 * Measures how unreliable the data is
 */
function noiseEngine({ impressions, dayCount }) {
  const volumeScore = normalize(impressions, 1000, 10000);
  const timeScore = normalize(dayCount, 3, 7);

  // Less volume + less time = more noise
  return clamp(1 - (volumeScore + timeScore) / 2);
}

/**
 * Measures consistency & predictability
 */
function stabilityEngine({ cpa, roas }) {
  const cpaScore = normalize(1 / cpa, 0.01, 0.05);
  const roasScore = normalize(roas, 1, 3);

  return clamp((cpaScore + roasScore) / 2);
}

function readinessClassifier(signal, noise) {
  if (signal > 0.7 && noise < 0.3) return "HIGH";
  if (signal > 0.4 && noise < 0.5) return "MEDIUM";
  return "LOW";
}

/**
 * MAIN EXPORT
 */
module.exports = function dataFusionEngine(metrics) {
  const signalStrength = signalStrengthEngine(metrics);
  const noiseLevel = noiseEngine(metrics);
  const stabilityScore = stabilityEngine(metrics);

  return {
    signalStrength,
    noiseLevel,
    stabilityScore,
    dataReadiness: readinessClassifier(signalStrength, noiseLevel)
  };
};
