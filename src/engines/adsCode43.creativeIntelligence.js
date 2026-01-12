/**
 * adsCode43.creativeIntelligenceV2.js
 * --------------------------------------------------
 * PURPOSE:
 * Analyze creative performance & suggest changes.
 * This engine CREATES options, not decisions.
 */

const { engineResult } = require("../core/engineResult");

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

class CreativeIntelligenceV2 {
  constructor(context) {
    this.context = context;
  }

  run() {
    const {
      ctr,
      hookStrength = 0,
      emotionalIntensity = 0,
      fatigueScore = 0,
      ctaAggression = 0,
      audienceSaturation = 0,
    } = this.context;

    if (!ctr) {
      return engineResult({
        engine: "AdsCode43_CreativeIntel",
        status: "INSUFFICIENT_DATA",
        impact: "LOW",
        authority: 2,
        score: 0.2,
        message: "CTR missing. Creative analysis skipped.",
      });
    }

    // Core problems
    const hookWeak = hookStrength < 0.4;
    const fatigueHigh = fatigueScore > 0.6;
    const ctaTooHard = ctaAggression > 0.7;
    const audienceBurned = audienceSaturation > 0.65;

    let suggestions = [];

    if (hookWeak)
      suggestions.push(
        "Change opening hook. Lead with outcome or pain, not features."
      );

    if (fatigueHigh)
      suggestions.push(
        "Creative fatigue detected. Rotate format or narrative angle."
      );

    if (ctaTooHard)
      suggestions.push(
        "CTA too aggressive. Shift to curiosity-based action."
      );

    if (audienceBurned)
      suggestions.push(
        "Audience saturated. Expand or reset targeting before new creatives."
      );

    if (suggestions.length === 0)
      suggestions.push("Creative healthy. No immediate changes required.");

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
          audienceBurned,
        },
        suggestions,
      },
    });
  }
}

module.exports = { CreativeIntelligenceV2 };
