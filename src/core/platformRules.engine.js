// src/core/platformRules.engine.js

const { adsCode03, adsCode10 } = require("../engines/adsCodeRegistry");
const engineResult = require("./engineResult");

class PlatformRulesEngine {
  constructor(context = {}) {
    this.context = context;
    this.engine = "platformRules";
  }

  async run() {
    const results = [];

    // Platform selection
    try {
      const platformSelection = await adsCode03.run(this.context);
      results.push(this._normalize("adsCode03_platformSelection", platformSelection));
    } catch (err) {
      results.push(
        engineResult({
          engine: "adsCode03_platformSelection",
          status: "FAIL",
          message: err.message || "Platform selection failed",
          confidence: 0
        })
      );
    }

    // Platform rules / compliance
    try {
      const platformRules = await adsCode10.run(this.context);
      results.push(this._normalize("adsCode10_platformRules", platformRules));
    } catch (err) {
      results.push(
        engineResult({
          engine: "adsCode10_platformRules",
          status: "FAIL",
          message: err.message || "Platform rules validation failed",
          confidence: 0
        })
      );
    }

    // Final decision for this core
    const failed = results.find(r => r.status === "FAIL");

    if (failed) {
      return engineResult({
        engine: this.engine,
        status: "FAIL",
        score: 0,
        message: "Platform rules violation",
        meta: { results }
      });
    }

    return engineResult({
      engine: this.engine,
      status: "PASS",
      score: 0.7,
      confidence: 0.7,
      message: "Platform rules satisfied",
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

module.exports = PlatformRulesEngine;
