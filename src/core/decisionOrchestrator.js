// src/core/decisionOrchestrator.js

const adsCodeRegistry = require("../engines/adsCodeRegistry");
const DecisionEngine = require("./decisionEngine");
const DecisionTrace = require("./decisionTrace");
const DecisionResponseFormatter = require("./decisionResponseFormatter");
const { buildContext } = require("./contextBuilder");

// Core engines
const AudienceIntelligenceEngine = require("./audienceIntelligence.engine");
const CreativeIntelligenceEngine = require("./creativeIntelligence.engine");
const CapitalProtectionEngine = require("./capitalProtection.engine");
const PerformanceRealityEngine = require("./performanceReality.engine");
const PlatformRulesEngine = require("./platformRules.engine");
const ScalingReadinessEngine = require("./scalingReadiness.engine");
const PredictionSimulationEngine = require("./predictionSimulation.engine");
const ExplainabilityEngine = require("./explainabilityEngine");

async function decisionOrchestrator(rawInput = {}) {
  // 1️⃣ Context
  const context = buildContext(rawInput);

  // 2️⃣ Trace
  const trace = new DecisionTrace(context);

  // 3️⃣ Decision Engine
  const decisionEngine = new DecisionEngine();

  // 4️⃣ Run core engines (NO adsCode here)
  const coreEngines = [
    new AudienceIntelligenceEngine(context),
    new CreativeIntelligenceEngine(context),
    new CapitalProtectionEngine(context),
    new PerformanceRealityEngine(context),
    new PlatformRulesEngine(context),
    new ScalingReadinessEngine(context),
    new PredictionSimulationEngine(context),
    new ExplainabilityEngine(context)
  ];

  for (const engine of coreEngines) {
    try {
      const result = engine.run();
      if (result) {
        decisionEngine.register(result);
        trace.record(result);
      }
    } catch (err) {
      trace.recordError(engine.constructor.name, err);
    }
  }

  // 5️⃣ Run ALL adsCode engines dynamically
  Object.values(adsCodeRegistry).forEach((AdsCode) => {
    try {
      if (typeof AdsCode !== "function") return;

      const instance = new AdsCode(context);
      if (!instance.run) return;

      const result = instance.run();

      if (result) {
        decisionEngine.register(result);
        trace.record(result);
      }
    } catch (err) {
      trace.recordError("AdsCodeEngine", err);
    }
  });

  // 6️⃣ Final decision
  const finalDecision = decisionEngine.resolve();

  // 7️⃣ Format response
  return DecisionResponseFormatter.format({
    decision: finalDecision,
    trace: trace.export()
  });
}

module.exports = decisionOrchestrator;
