// src/core/decisionOrchestrator.js

class DecisionOrchestrator {
  constructor(engines, options = {}) {
    this.engines = engines || [];
    this.weights = options.weights || {
      fraud: 1.5,
      budget: 1.2,
      performance: 1.0,
      creative: 0.8,
      generic: 1.0,
    };
  }

  _engineWeight(engine) {
    return this.weights[engine.type] || this.weights.generic;
  }

  async run({ metrics, context }) {
    const results = [];
    for (const engine of this.engines) {
      try {
        const out = await engine.run({ metrics, context });
        results.push({
          name: engine.name,
          type: engine.type || "generic",
          action: out.action, // RUN | PAUSE | KILL
          risk: Number(out.risk || 0), // 0..1
          reasons: out.reasons || [],
          suggestions: out.suggestions || [],
          weight: this._engineWeight(engine),
        });
      } catch (e) {
        results.push({
          name: engine.name,
          type: engine.type || "generic",
          action: "PAUSE",
          risk: 0.5,
          reasons: ["Engine error → conservative pause"],
          suggestions: [],
          weight: this._engineWeight(engine),
        });
      }
    }

    // ---- B2: CONSENSUS (Voting + Risk Override)
    let score = { RUN: 0, PAUSE: 0, KILL: 0 };
    let maxRisk = 0;

    for (const r of results) {
      score[r.action] += r.weight;
      maxRisk = Math.max(maxRisk, r.risk);
      // High-risk override
      if (r.risk >= 0.85 && r.action === "KILL") {
        return this._finalize("KILL", results, maxRisk, true);
      }
    }

    const action =
      score.KILL >= score.RUN && score.KILL >= score.PAUSE
        ? "KILL"
        : score.PAUSE >= score.RUN
        ? "PAUSE"
        : "RUN";

    // ---- B3: CONFIDENCE
    const total = score.RUN + score.PAUSE + score.KILL || 1;
    const confidence = Number((Math.max(score.RUN, score.PAUSE, score.KILL) / total).toFixed(2));

    return this._finalize(action, results, maxRisk, false, confidence);
  }

  _finalize(action, results, maxRisk, overridden, confidence = 0.5) {
    return {
      action,
      confidence,
      risk: Number(maxRisk.toFixed(2)),
      overridden,
      trace: results,
    };
  }
}

module.exports = DecisionOrchestrator;
