// src/core/decisionOrchestrator.js

const DataFusionEngine = require("./dataFusionEngine");
const ObjectiveBudgetEngine = require("./objectiveBudget.engine");
const PlatformRulesEngine = require("./platformRules.engine");
const CreativeIntelligenceEngine = require("./creativeIntelligence.engine");
const FunnelIntegrityEngine = require("./funnelIntegrity.engine");
const CapitalProtectionEngine = require("./capitalProtection.engine");
const ScalingReadinessEngine = require("./scalingReadiness.engine");
const PredictionSimulationEngine = require("./predictionSimulation.engine");
const DecisionEngine = require("./decisionEngine");
const ExplainabilityEngine = require("./explainabilityEngine");

async function decisionOrchestrator(rawContext = {}) {
  const context = DataFusionEngine.run(rawContext);

  const objectiveBudget = ObjectiveBudgetEngine.run(context);
  if (!objectiveBudget.valid) {
    return earlyExit("STOP", "Objective or budget invalid");
  }

  const platformRules = PlatformRulesEngine.run(context);
  if (!platformRules.allowed) {
    return earlyExit("STOP", "Platform rules violation");
  }

  const creativeHealth = CreativeIntelligenceEngine.run(context);
  const funnelHealth = FunnelIntegrityEngine.run(context);

  const capitalSafety = CapitalProtectionEngine.run(context);
  if (!capitalSafety.safe) {
    return earlyExit("STOP", "Capital at high risk");
  }

  const scaling = ScalingReadinessEngine.run(context);

  const prediction = PredictionSimulationEngine.run({
    context,
    creativeHealth,
    funnelHealth,
    scaling
  });

  const decision = DecisionEngine.run({
    objectiveBudget,
    platformRules,
    creativeHealth,
    funnelHealth,
    capitalSafety,
    scaling,
    prediction
  });

  const explanation = ExplainabilityEngine.run({
    decision,
    signals: {
      creativeHealth,
      funnelHealth,
      capitalSafety,
      scaling,
      prediction
    }
  });

  return {
    decision: decision.action,
    confidence: decision.confidence,
    risk: prediction.riskLevel,
    why: explanation.reasons,
    moneyAdvice: decision.moneyMove,
    ifIgnored: prediction.ifIgnored
  };
}

function earlyExit(action, reason) {
  return {
    decision: action,
    confidence: 0.3,
    risk: "HIGH",
    why: [reason],
    moneyAdvice: "HOLD",
    ifIgnored: "High probability of loss"
  };
}

module.exports = decisionOrchestrator; // ✅ IMPORTANT
