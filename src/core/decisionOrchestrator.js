// src/core/decisionOrchestrator.js

const { buildContext } = require("./contextBuilder");
const DecisionEngine = require("./decisionEngine");
const DecisionResponseFormatter = require("./decisionResponseFormatter");
const DecisionTrace = require("./decisionTrace");

// Core Engines
const AudienceIntelligenceEngine = require("./audienceIntelligence.engine");
const CreativeIntelligenceEngine = require("./creativeIntelligence.engine");
const CapitalProtectionEngine = require("./capitalProtection.engine");
const FunnelIntegrityEngine = require("./funnelIntegrity.engine");
const PerformanceRealityEngine = require("./performanceReality.engine");
const PlatformRulesEngine = require("./platformRules.engine");
const ObjectiveBudgetEngine = require("./objectiveBudget.engine");
const ScalingReadinessEngine = require("./scalingReadiness.engine");
const PredictionSimulationEngine = require("./predictionSimulation.engine");
const ExplainabilityEngine = require("./explainabilityEngine");

async function decisionOrchestrator(rawInput = {}) {
  // 1️⃣ Build SAFE context (no undefined explosions)
  const context = buildContext(rawInput);

  // 2️⃣ Trace init (debug + explainability)
  const trace = new DecisionTrace(context);

  // 3️⃣ Decision engine (aggregator)
  const decisionEngine = new DecisionEngine();

  // 4️⃣ Core engines list (ORDER MATTERS)
  const coreEngines = [
    new AudienceIntelligenceEngine(context),
    new CreativeIntelligenceEngine(context),
    new CapitalProtectionEngine(context),
    new FunnelIntegrityEngine(context),
    new PerformanceRealityEngine(context),
    new PlatformRulesEngine(context),
    new ObjectiveBudgetEngine(context),
    new ScalingReadinessEngine(context),
    new PredictionSimulationEngine(context),
    new ExplainabilityEngine(context)
  ];

  // 5️⃣ Run all core engines safely
  for (const engine of coreEngines) {
    try {
      const results = engine.run();

      // Some engines return array, some single
      const normalized = Array.isArray(results) ? results : [results];

      for (const result of normalized) {
        if (!result) continue;
        decisionEngine.register(result);
        trace.record(result);
      }
    } catch (err) {
      // HARD FAIL SAFE
      decisionEngine.register({
        engine: engine.constructor.name,
        status: "FAIL",
        impact: "HIGH",
        score: 0,
        message: err.message || "Engine crashed"
      });

      trace.recordError(engine.constructor.name, err);
    }
  }

  // 6️⃣ Resolve final decision
  const finalDecision = decisionEngine.resolve();

  // 7️⃣ Format response
  const response = DecisionResponseFormatter.format({
    decision: finalDecision,
    trace: trace.export()
  });

  return response;
}

module.exports = decisionOrchestrator;
