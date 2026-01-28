// src/core/decisionOrchestrator.js

const DecisionEngine = require("./decisionEngine");
const { engineResult } = require("./engineResult");
const { buildDecisionTrace } = require("./decisionTrace");
const generatePrescription = require("./prescriptionGenerator");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run(context = {}) {
    const decisionEngine = new DecisionEngine();
    const collectedResults = [];

    // 1. Run all engines safely
    for (const Engine of this.engines) {
      try {
        const instance =
          typeof Engine === "function" ? new Engine(context) : Engine;

        if (!instance || typeof instance.run !== "function") continue;

        const result = await instance.run();
        this._normalize(result, collectedResults);
      } catch (err) {
        collectedResults.push(
          engineResult({
            engine: Engine?.name || "UnknownEngine",
            status: "FAIL",
            message: err.message || "Engine crashed",
            confidence: 0
          })
        );
      }
    }

    // 2. Feed results into decision engine
    collectedResults.forEach((r) => decisionEngine.register(r));

    const decision = decisionEngine.resolve();

    const finalStatus =
      decision.action === "KILL"
        ? "FAIL"
        : decision.action === "PAUSE"
        ? "WARNING"
        : "PASS";

    const trace = buildDecisionTrace(
      collectedResults,
      finalStatus,
      decision.confidence
    );

    // 3. 🔥 PRESCRIPTION LAYER (NEW)
    const prescription = generatePrescription({
      action: decision.action,
      finalStatus,
      confidence: decision.confidence,
      risk: decision.risk,
      reasons: decision.reasons,
      engines: collectedResults
    });

    // 4. Final response (API-safe)
    return {
      action: decision.action,
      score: decision.score,
      risk: decision.risk,
      confidence: decision.confidence,
      reasons: decision.reasons,
      finalStatus,
      trace,
      prescription
    };
  }

  // ---------- Normalizer (DO NOT TOUCH) ----------
  _normalize(result, bucket) {
    if (!result) return;

    // Array support
    if (Array.isArray(result)) {
      result.forEach((r) => this._normalize(r, bucket));
      return;
    }

    // Already normalized
    if (result.engine && result.status) {
      bucket.push(result);
      return;
    }

    // Fallback normalization
    bucket.push(
      engineResult({
        engine: result.engine || "AnonymousEngine",
        status: result.status || "PASS",
        score: result.score ?? null,
        message: result.message || "",
        confidence: result.confidence ?? 0.5,
        meta: result.meta || {}
      })
    );
  }
}

module.exports = DecisionOrchestrator;
