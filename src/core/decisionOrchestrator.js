// src/core/decisionOrchestrator.js

const DataFusionEngine = require("../engines/adsCode00.dataFusion");
const DataTrustEngine = require("../engines/dataTrust.engine");
const ObjectiveBudgetEngine = require("../engines/objectiveBudget.engine");
const PlatformRulesEngine = require("../engines/platformRules.engine");
const CreativeIntelligenceEngine = require("../engines/creativeIntelligence.engine");
const FunnelIntegrityEngine = require("../engines/funnelIntegrity.engine");
const CapitalProtectionEngine = require("../engines/capitalProtection.engine");
const ScalingReadinessEngine = require("../engines/scalingReadiness.engine");
const PredictionSimulationEngine = require("../engines/predictionSimulation.engine");
const DecisionEngine = require("../engines/decision.engine");
const ExplainabilityEngine = require("../engines/explainabilityEngine");

async function decisionOrchestrator(rawContext = {}) {
  const context = await DataFusionEngine.run(rawContext);

  const dataTrust = await DataTrustEngine.run(context);
  if (!dataTrust.trusted) {
    return earlyExit("PAUSE", "Data not reliable yet");
  }

  const objectiveBudget = await ObjectiveBudgetEngine.run(context);
  if (!objectiveBudget.valid) {
    return earlyExit("STOP", "Objective or budget invalid");
  }

  const platformRules = await PlatformRulesEngine.run(context);
  if (!platformRules.allowed) {
    return earlyExit("STOP", "Platform rules violation");
  }

  const creativeHealth = await CreativeIntelligenceEngine.run(context);
  const funnelHealth = await FunnelIntegrityEngine.run(context);

  const capitalSafety = await CapitalProtectionEngine.run(context);
  if (!capitalSafety.safe) {
    return earlyExit("STOP", "Capital at high risk");
  }

  const scaling = await ScalingReadinessEngine.run(context);

  const prediction = await PredictionSimulationEngine.run({
    context,
    creativeHealth,
    funnelHealth,
    scaling
  });

  const decision = await DecisionEngine.run({
    dataTrust,
    objectiveBudget,
    platformRules,
    creativeHealth,
    funnelHealth,
    capitalSafety,
    scaling,
    prediction
  });

  const explanation = await ExplainabilityEngine.run({
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

module.exports = decisionOrchestrator;
