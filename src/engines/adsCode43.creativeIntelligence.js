const { engineResult } = require("../core/engineResult");

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

module.exports = function adsCode43(context = {}) {
  const {
    ctr,
    hookStrength = 0,
    emotionalIntensity = 0,
    fatigueScore = 0,
    ctaAggression = 0,
    audienceSaturation = 0
  } = context;

  if (!ctr) {
    return engineResult({
      engine: "AdsCode43_CreativeIntel",
      status: "INSUFFICIENT_DATA",
      impact: "LOW",
      authority: 2,
      score: 0.2,
      message: "CTR missing. Creative analysis skipped."
    });
  }

  const hookWeak = hookStrength < 0.4;
  const fatigueHigh = fatigueScore > 0.6;
  const ctaTooHard = ctaAggression > 0.7;
  const audienceBurned = audienceSaturation > 0.65;

  const suggestions = [];
  if (hookWeak) suggestions.push("Strengthen opening hook.");
  if (fatigueHigh) suggestions.push("Rotate creative format.");
  if (ctaTooHard) suggestions.push("Reduce CTA aggression.");
  if (audienceBurned) suggestions.push("Expand or reset targeting.");
  if (!suggestions.length) suggestions.push("Creative healthy.");

  const creativeHealth = clamp(
    ctr * (1 - fatigueScore) * (1 - audienceSaturation)
  );

  return engineResult({
    engine: "AdsCode43_CreativeIntel",
    status: "ANALYSIS_READY",
    impact: creativeHealth < 0.4 ? "HIGH" : "MEDIUM",
    authority: 3,
    score: creativeHealth,
    message: "Creative intelligence analysis completed.",
    creativeInsights: {
      healthScore: Number(creativeHealth.toFixed(2)),
      problemsDetected: {
        hookWeak,
        fatigueHigh,
        ctaTooHard,
        audienceBurned
      },
      suggestions
    }
  });
};
