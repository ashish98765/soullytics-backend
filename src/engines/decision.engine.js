// src/engines/decision.engine.js

function decisionEngine({ platform, objective, budget }) {
  let decision = {
    platform,
    objective,
    budget,
    strategy: null,
    creativeAngle: null,
    riskLevel: null,
    confidence: null
  };

  // PLATFORM + OBJECTIVE LOGIC
  if (platform === "meta") {
    if (objective === "leads") {
      decision.strategy = "Lead Form Campaign";
      decision.creativeAngle = "Trust + Offer";
      decision.riskLevel = "Medium";
      decision.confidence = 0.78;
    } else if (objective === "sales") {
      decision.strategy = "Conversion Campaign";
      decision.creativeAngle = "Urgency + Discount";
      decision.riskLevel = "High";
      decision.confidence = 0.65;
    }
  }

  if (platform === "google") {
    if (objective === "sales") {
      decision.strategy = "Search Intent Campaign";
      decision.creativeAngle = "Problem → Solution";
      decision.riskLevel = "Low";
      decision.confidence = 0.85;
    } else if (objective === "leads") {
      decision.strategy = "Search + Display Mix";
      decision.creativeAngle = "Authority + Proof";
      decision.riskLevel = "Medium";
      decision.confidence = 0.72;
    }
  }

  // BUDGET LOGIC
  if (budget < 500) {
    decision.riskLevel = "High";
    decision.confidence -= 0.15;
  } else if (budget > 2000) {
    decision.confidence += 0.05;
  }

  return decision;
}

module.exports = decisionEngine;
