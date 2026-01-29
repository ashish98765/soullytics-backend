// src/core/decisionOrchestrator.js

const DecisionEngine = require("./decisionEngine");
const adjustAction = require("./finalDecisionAdjuster");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run({ metrics = {}, context = {} } = {}) {
    const decisionEngine = new DecisionEngine();
    const collected = [];

    for (const Engine of this.engines) {
      try {
        const instance =
          typeof Engine === "function" ? new Engine(metrics) : Engine;

        if (!instance || typeof instance.run !== "function") continue;

        const result = await instance.run();
        normalize(result, collected);
      } catch (err) {
        collected.push({
          status: "FAIL",
          score: 0,
          risk: 1,
          confidence: 0,
          message: err.message || "Engine crashed"
        });
      }
    }

    collected.forEach(r => decisionEngine.register(r));
    const baseDecision = decisionEngine.resolve();

    const total = collected.length || 1;
    const fails = collected.filter(r => r.status === "FAIL").length;
    const failRatio = fails / total;

    const finalAction = adjustAction(
      baseDecision.action,
      baseDecision.confidence,
      failRatio
    );

    return {
      action: finalAction,
      score: baseDecision.score,
      risk: baseDecision.risk,
      confidence: baseDecision.confidence,
      reasons: baseDecision.reasons,
      meta: {
        failRatio,
        enginesRun: total
      }
    };
  }
}

function normalize(result, bucket) {
  if (!result) return;

  if (Array.isArray(result)) {
    result.forEach(r => normalize(r, bucket));
    return;
  }

  bucket.push({
    status: result.status || "PASS",
    score: Number(result.score) || 0,
    risk: Number(result.risk) || 0,
    confidence: Number(result.confidence) || 0.5,
    message: result.message || ""
  });
}

module.exports = DecisionOrchestrator;
