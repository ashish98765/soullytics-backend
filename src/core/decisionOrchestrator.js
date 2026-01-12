// src/core/decisionOrchestrator.js

const DataFusionEngine = require("./dataFusionEngine");
const DataTrustEngine = require("./dataTrust.engine");
const ObjectiveBudgetEngine = require("./objectiveBudget.engine");
const PlatformRulesEngine = require("./platformRules.engine");
const CreativeIntelligenceEngine = require("./creativeIntelligence.engine");
const FunnelIntegrityEngine = require("./funnelIntegrity.engine");
const CapitalProtectionEngine = require("./capitalProtection.engine");
const ScalingReadinessEngine = require("./scalingReadiness.engine");
const PredictionSimulationEngine = require("./predictionSimulation.engine");
const DecisionEngine = require("./decision.engine");
const ExplainabilityEngine = require("./explainabilityEngine");

/**
 * MAIN DECISION ORCHESTRATOR
 */
async function decisionOrchestrator(rawContext = {}) {
  // STEP 0: DATA FUSION
  const context = await DataFusionEngine.run(rawContext);

  // STEP 1: DATA TRUST
  const dataTrust = await DataTrustEngine.run(context);
  if (!dataTrust.trusted) {
    return earlyExit("PAUSE", "Data not reliable yet");
  }

  // STEP 2: OBJECTIVE & BUDGET
  const objectiveBudget = await ObjectiveBudgetEngine.run(context);
  if (!objectiveBudget.valid) {
    return earlyExit("STOP", "Objective or budget invalid");
  }

  // STEP 3: PLATFORM RULES
  const platformRules = await PlatformRulesEngine.run(context);
  if (!platformRules.allowed) {
    return earlyExit("STOP", "Platform rules violation");
  }

  // STEP 4: CREATIVE INTELLIGENCE
  const creativeHealth = await CreativeIntelligenceEngine.run(context);

  // STEP 5: FUNNEL INTEGRITY
  const funnelHealth = await FunnelIntegrityEngine.run(context);

  // STEP 6: CAPITAL PROTECTION
  const capitalSafety = await CapitalProtectionEngine.run(context);
  if (!capitalSafety.safe) {
    return earlyExit("STOP", "Capital at high risk");
  }

  // STEP 7: SCALING READINESS
  const scaling = await ScalingReadinessEngine.run(context);

  // STEP 8: FUTURE SIMULATION
  const prediction = await PredictionSimulationEngine.run({
    context,
    creativeHealth,
    funnelHealth,
    scaling
  });

  // STEP 9: FINAL DECISION
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

  // STEP 10: EXPLAINABILITY
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

  // FINAL RESPONSE (LOCKED SHAPE)
  return {
    decision: decision.action,          // RUN | PAUSE | STOP | SCALE
    confidence: decision.confidence,     // 0–1
    risk: prediction.riskLevel,          // LOW | MEDIUM | HIGH
    why: explanation.reasons,             // array of strings
    moneyAdvice: decision.moneyMove,     // +20%, -30%, HOLD
    ifIgnored: prediction.ifIgnored       // risk explanation
  };
}

/**
 * EARLY EXIT HELPER
 */
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
