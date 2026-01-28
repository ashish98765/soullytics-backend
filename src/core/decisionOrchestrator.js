// src/core/decisionOrchestrator.js

const DecisionEngine = require("./decisionEngine");
const engineResult = require("./engineResult");
const { buildDecisionTrace } = require("./decisionTrace");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run(context = {}) {
    const decisionEngine = new DecisionEngine();
    const collectedResults = [];

    /* -------------------------------------------------
       1. Run all engines safely (NO engine changes)
    ------------------------------------------------- */
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
            score: null,
            message: err.message || "Engine crashed",
            confidence: 0,
          })
        );
      }
    }

    /* -------------------------------------------------
       2. Feed results into decision engine
    ------------------------------------------------- */
    collectedResults.forEach(r => decisionEngine.register(r));
    const decision = decisionEngine.resolve();

    /* -------------------------------------------------
       3. SCALE logic (no engine touched)
    ------------------------------------------------- */
    const total = collectedResults.length || 1;
    const failCount = collectedResults.filter(r => r.status === "FAIL").length;
    const failRatio = failCount / total;

    let finalAction = decision.action;

    if (
      decision.action === "RUN" &&
      decision.confidence >= 0.75 &&
      decision.risk <= 0.3 &&
      failRatio <= 0.1
    ) {
      finalAction = "SCALE";
    }

    /* -------------------------------------------------
       4. Final status mapping
    ------------------------------------------------- */
    const finalStatus =
      finalAction === "KILL"
        ? "FAIL"
        : finalAction === "PAUSE"
        ? "WARNING"
        : finalAction === "SCALE"
        ? "PASS"
        : "PASS";

    /* -------------------------------------------------
       5. Prescription layer (frontend ready)
    ------------------------------------------------- */
    const prescription = this._buildPrescription({
      action: finalAction,
      confidence: decision.confidence,
      risk: decision.risk,
      failCount,
      total,
    });

    /* -------------------------------------------------
       6. Unified response
    ------------------------------------------------- */
    return {
      action: finalAction,
      score: decision.score || 0,
      risk: decision.risk || 0,
      confidence: decision.confidence || 0,
      reasons: decision.reasons || [],
      finalStatus,
      prescription,
      trace: buildDecisionTrace(
        collectedResults,
        finalStatus,
        decision.confidence || 0
      ),
    };
  }

  /* =================================================
     Helpers
  ================================================= */

  _normalize(result, bucket) {
    if (!result) return;

    // Array of results
    if (Array.isArray(result)) {
      result.forEach(r => this._normalize(r, bucket));
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
        meta: result.meta || {},
      })
    );
  }

  _buildPrescription({ action, confidence, risk, failCount, total }) {
    const why = [];
    const fix = [];

    if (confidence < 0.5) why.push("Low decision confidence");
    if (risk > 0.6) why.push("High risk detected");
    if (failCount > 0)
      why.push(`${failCount} of ${total} engines failed`);

    if (action === "PAUSE" || action === "KILL") {
      fix.push("Improve ad creatives (hook, copy, visuals)");
      fix.push("Fix budget and bidding strategy");
      fix.push("Resolve failed engine signals");
    }

    if (action === "SCALE") {
      fix.push("Increase budget gradually");
      fix.push("Duplicate winning creatives");
      fix.push("Expand audience targeting");
    }

    return {
      summary:
        action === "SCALE"
          ? "Ads performing strongly. Ready to scale."
          : action === "RUN"
          ? "Ads are stable and safe to continue."
          : action === "PAUSE"
          ? "Ads paused due to weak performance signals."
          : "Ads blocked due to critical issues.",
      why,
      what_to_fix: fix,
      next_action: action,
      when_to_scale:
        "Confidence > 0.75, Risk < 0.3, Engine failures < 10%",
    };
  }
}

module.exports = DecisionOrchestrator;
