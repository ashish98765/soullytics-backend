// src/core/scalingReadiness.engine.js

const { ScalingReadinessEngine } = require("../adsCode16.scalingReadiness");
const { BurnRateEngine } = require("../adsCode26.burnRate");
const engineResult = require("./engineResult");

class ScalingReadinessCoreEngine {
  constructor(context = {}) {
    this.context = context;
    this.engine = "scalingReadiness";
  }

  async run() {
    const results = [];

    // Scaling readiness
    try {
      const res = await new ScalingReadinessEngine(this.context).run();
      results.push(this._normalize("adsCode16_scalingReadiness", res));
    } catch (err) {
      results.push(
        engineResult({
          engine: "adsCode16_scalingReadiness",
          status: "FAIL",
          message: err.message || "Scaling readiness failed",
          confidence: 0
        })
      );
    }

    // Burn rate
    try {
      const res = await new BurnRateEngine(this.context).run();
      results.push(this._normalize("adsCode26_burnRate", res));
    } catch (err) {
      results.push(
        engineResult({
          engine: "adsCode26_burnRate",
          status: "FAIL",
          message: err.message || "Burn rate failed",
          confidence: 0
        })
      );
    }

    const failed = results.find(r => r.status === "FAIL");

    if (failed) {
      return engineResult({
        engine: this.engine,
        status: "FAIL",
        score: 0,
        message: "Scaling not safe",
        meta: { results }
      });
    }

    return engineResult({
      engine: this.engine,
      status: "PASS",
      score: 0.6,
      confidence: 0.6,
      message: "Scaling is safe",
      meta: { results }
    });
  }

  _normalize(engineName, res) {
    if (res && res.engine && res.status) return res;

    return engineResult({
      engine: engineName,
      status: res?.status || "PASS",
      score: res?.score ?? 0.5,
      confidence: res?.confidence ?? 0.5,
      message: res?.message || "OK",
      meta: res || {}
    });
  }
}

module.exports = ScalingReadinessCoreEngine;
