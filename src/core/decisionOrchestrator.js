// src/core/decisionOrchestrator.js

const dataFusionEngine = require("./dataFusionEngine");
const objectiveBudgetEngine = require("./objectiveBudget.engine");
const platformRulesEngine = require("./platformRules.engine");
const creativeIntelligenceEngine = require("./creativeIntelligence.engine");
const funnelIntegrityEngine = require("./funnelIntegrity.engine");
const capitalProtectionEngine = require("./capitalProtection.engine");
const scalingReadinessEngine = require("./scalingReadiness.engine");
const predictionSimulationEngine = require("./predictionSimulation.engine");
const explainabilityEngine = require("./explainabilityEngine");
const DecisionEngine = require("./decisionEngine");

/**
 * MAIN ORCHESTRATOR
 * This file only:
 * - calls core engines
 * - collects results
 * - passes to DecisionEngine
 * NO adsCode direct calls here
 */
async function decisionOrchestrator(rawContext = {}) {
  try {
    // 1️⃣ DATA FUSION
    const fusedContext = await dataFusionEngine(rawContext);

    // 2️⃣ CORE ENGINE SIGNALS
    const objectiveBudget = objectiveBudgetEngine.run(fusedContext);
    const platformRules = platformRulesEngine.run(fusedContext);
    const creativeHealth = creativeIntelligenceEngine.run(fusedContext);
    const funnelHealth = funnelIntegrityEngine.run(fusedContext);
    const capitalSafety = capitalProtectionEngine.run(fusedContext);
    const scaling = scalingReadinessEngine.run(fusedContext);
    const prediction = predictionSimulationEngine.run({
      context: fusedContext,
      creativeHealth,
      funnelHealth,
      scaling
    });

    // 3️⃣ FINAL DECISION
    const decision = DecisionEngine.run({
      objectiveBudget,
      platformRules,
      creativeHealth,
      funnelHealth,
      capitalSafety,
      scaling,
      prediction
    });

    // 4️⃣ EXPLAINABILITY
    const explanation = explainabilityEngine.run({
      decision,
      signals: {
        objectiveBudget,
        platformRules,
        creativeHealth,
        funnelHealth,
        capitalSafety,
        scaling,
        prediction
      }
    });

    // 5️⃣ FINAL RESPONSE
    return {
      decision: decision.action,           // RUN | PAUSE | STOP
      confidence: decision.confidence,     // 0–1
      reasons: explanation.reasons || [],
      risk: prediction?.riskLevel || "UNKNOWN"
    };
  } catch (error) {
    // HARD FAIL SAFE
    return {
      decision: "STOP",
      confidence: 0.1,
      reasons: ["System error in decision orchestration"],
      error: error.message
    };
  }
}

module.exports = { decisionOrchestrator };
