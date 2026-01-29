// src/core/decisionOrchestrator.js

const DecisionEngine = require("./decisionEngine");
const engineResult = require("./engineResult");
const { buildDecisionTrace } = require("./decisionTrace");
const ExplainabilityEngine = require("./explainabilityEngine");

const {
  saveDecision,
  updateEngineStats,
  detectPatterns
} = require("./decisionLearning");

const calibrateConfidence = require("./confidenceLearner");
const adjustAction = require("./finalDecisionAdjuster");

function detectGroup(engineName = "") {
  const name = engineName.toLowerCase();
  if (name.includes("creative")) return "CREATIVE";
  if (name.includes("budget")) return "BUDGET";
  if (name.includes("audience")) return "AUDIENCE";
  if (name.includes("risk")) return "RISK";
  if (name.includes("scale")) return "SCALING";
  return "GENERAL";
}

function mapSeverity(status) {
  if (status === "FAIL") return "HIGH";
  if (status === "WARNING") return "MEDIUM";
  return "LOW";
}

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run(payload = {}) {
    const decisionEngine = new DecisionEngine();
    const collected = [];

    /** 1. Run engines safely */
    for (const Engine of this.engines) {
      try {
        const instance =
          typeof Engine === "function" ? new Engine(payload) : Engine;

        if (!instance || typeof instance.run !== "function") continue;

        const result = await instance.run();

        collected.push(
          engineResult({
            engine: instance.constructor.name,
            group: detectGroup(instance.constructor.name),
            status: result.status || "PASS",
            severity: mapSeverity(result.status || "PASS"),
            score: result.score || 0,
            risk: result.risk || 0,
            confidence: result.confidence ?? 0.5,
            message: result.message || ""
          })
        );
      } catch (err) {
        collected.push(
          engineResult({
            engine: Engine?.name || "UnknownEngine",
            group: detectGroup(Engine?.name),
            status: "FAIL",
            severity: "HIGH",
            score: 0,
            risk: 1,
            confidence: 0,
            message: err.message || "Engine crashed"
          })
        );
      }
    }

    /** 2. Resolve decision */
    collected.forEach(r => decisionEngine.register(r));
    const decision = decisionEngine.resolve();

    /** 3. Metrics */
    const total = collected.length || 1;
    const failCount = collected.filter(r => r.status === "FAIL").length;
    const failRatio = failCount / total;

    /** 4. Learning */
    const learnedConfidence = calibrateConfidence(
      decision.confidence || 0,
      total,
      failRatio
    );

    const finalAction = adjustAction(
      decision.action,
      learnedConfidence,
      failRatio
    );

    /** 5. Final status */
    const finalStatus =
      finalAction === "KILL"
        ? "FAIL"
        : finalAction === "PAUSE"
        ? "WARNING"
        : "PASS";

    /** 6. Async learning (non-blocking) */
    try {
      if (payload.context?.userId) {
        saveDecision(
          payload.context.userId,
          {
            action: finalAction,
            score: decision.score || 0,
            risk: decision.risk || 0,
            confidence: learnedConfidence,
            finalStatus
          },
          { failCount, total }
        );

        updateEngineStats(collected);
        detectPatterns(payload.context.userId, { action: finalAction });
      }
    } catch (e) {
      console.error("Learning layer error:", e.message);
    }

    /** 7. Trace + Explainability */
    const trace = buildDecisionTrace(collected, finalAction, learnedConfidence);

    const explainability = new ExplainabilityEngine(payload.context || {});
    const explanation = explainability.run(
      { ...decision, action: finalAction, confidence: learnedConfidence },
      trace
    );

    /** 8. Final response */
    return {
      action: finalAction,
      score: decision.score || 0,
      risk: decision.risk || 0,
      confidence: learnedConfidence,
      reasons: decision.reasons || [],
      explanation,
      trace,
      meta: {
        enginesRun: total,
        enginesFailed: failCount,
        failRatio
      }
    };
  }
}

module.exports = DecisionOrchestrator;
