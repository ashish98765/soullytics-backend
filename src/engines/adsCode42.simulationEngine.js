const { engineResult } = require("../core/engineResult");

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

module.exports = function adsCode42(context = {}) {
  const {
    currentCPA,
    targetCPA,
    roas = 0,
    budget,
    burnRate = 0,
    scalingReadiness = 0,
    riskScore = 0
  } = context;

  if (!currentCPA || !budget) {
    return engineResult({
      engine: "AdsCode42_Simulation",
      status: "INSUFFICIENT_DATA",
      impact: "LOW",
      authority: 2,
      score: 0.2,
      message: "Missing core inputs for simulation."
    });
  }

  const scaleCPA = currentCPA * (1 + (1 - scalingReadiness) * 0.35);
  const scaleRisk = clamp((scaleCPA - targetCPA) / targetCPA);

  const holdRisk = clamp(burnRate / budget);

  const pauseLossSaved = burnRate * 3;
  const pauseOpportunityCost = roas > 2 ? 0.4 : 0.1;

  return engineResult({
    engine: "AdsCode42_Simulation",
    status: "SIMULATION_READY",
    impact: scaleRisk > 0.6 ? "HIGH" : "MEDIUM",
    authority: 4,
    score: clamp((1 - scaleRisk + (1 - holdRisk)) / 2),
    message: "What-if simulation completed.",
    simulations: {
      SCALE: {
        projectedCPA: Number(scaleCPA.toFixed(2)),
        risk: Number(scaleRisk.toFixed(2)),
        verdict: scaleRisk > 0.5 ? "DANGEROUS" : "SAFE"
      },
      HOLD: {
        burnRate: Number(burnRate.toFixed(2)),
        risk: Number(holdRisk.toFixed(2)),
        verdict: holdRisk > 0.4 ? "BLEEDING" : "STABLE"
      },
      PAUSE: {
        capitalSaved: Number(pauseLossSaved.toFixed(2)),
        opportunityCost: pauseOpportunityCost,
        verdict: pauseOpportunityCost > 0.3 ? "GROWTH_LOSS" : "SMART_EXIT"
      }
    }
  });
};
