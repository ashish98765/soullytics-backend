// src/core/decisionOrchestrator.js

const DataFusionEngine = require("./dataFusionEngine");
const ObjectiveBudgetEngine = require("./objectiveBudget.engine");
const PlatformRulesEngine = require("./platformRules.engine");
const CreativeIntelligenceEngine = require("./creativeIntelligence.engine");
const FunnelIntegrityEngine = require("./funnelIntegrity.engine");
const CapitalProtectionEngine = require("./capitalProtection.engine");
const ScalingReadinessEngine = require("./scalingReadiness.engine");
const PredictionSimulationEngine = require("./predictionSimulation.engine");
const ExplainabilityEngine = require("./explainabilityEngine");
const DecisionEngine = require("./decisionEngine");

async function decisionOrchestrator(rawContext = {}) {
  // STEP 1: DATA FUSION
  const context = DataFusionEngine.run(rawContext);

  // STEP 2: OBJECTIVE + BUDGET
  const objectiveBudget = ObjectiveBudgetEngine.run(context);
  if (!objectiveBudget.valid) {
    return earlyExit("STOP", "Objective or budget invalid");
  }

  // STEP 3: PLATFORM RULES
  const platformRules = PlatformRulesEngine.run(context);
  if (!platformRules.allowed) {
    return earlyExit("STOP", "Platform rules violation");
  }

  // STEP 4: CREATIVE INTELLIGENCE
  const creativeHealth = CreativeIntelligenceEngine.run(context);

  // STEP 5: FUNNEL INTEGRITY
  const funnelHealth = FunnelIntegrityEngine.run(context);

  // STEP 6: CAPITAL PROTECTION
  const capitalSafety = CapitalProtectionEngine.run(context);
  if (!capitalSafety.safe) {
    return earlyExit("STOP", "Capital at high risk");
  }

  // STEP 7: SCALING READINESS
  const scaling = ScalingReadinessEngine.run(context);

  // STEP 8: PREDICTION SIMULATION
  const prediction = PredictionSimulationEngine.run({
    context,
    creativeHealth,
    funnelHealth,
    scaling
  });

  // STEP 9: FINAL DECISION
  const decision = DecisionEngine.run({
    objectiveBudget,
    platformRules,
    creativeHealth,
    funnelHealth,
    capitalSafety,
    scaling,
    prediction
  });

  // STEP 10: EXPLAINABILITY
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

  // FINAL RESPONSE
  return {
    decision: decision.action,        // RUN | PAUSE | STOP | SCALE
    confidence: decision.confidence,  // 0–1
    risk: prediction.riskLevel,       // LOW | MEDIUM | HIGH
    why: explanation.reasons,
    moneyAdvice: decision.moneyMove,  // +%, -, HOLD
    ifIgnored: prediction.ifIgnored
  };
}

// EARLY EXIT
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

module.exports = { decisionOrchestrator };
