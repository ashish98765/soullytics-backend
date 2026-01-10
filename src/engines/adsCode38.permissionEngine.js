// src/engines/adsCode38.permissionEngine.js

const { engineResult } = require("../core/engineResult");

class PermissionEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const overrideCount = Number(this.context.overrideCount || 0);
    const trustScore = Number(this.context.trustScore || 0.5); // 0–1
    const riskTolerance = this.context.riskTolerance || "MEDIUM";

    // ❌ Override blocked
    if (overrideCount >= 3 && trustScore < 0.4) {
      return engineResult({
        engine: "AdsCode38_Permission",
        status: "FAIL",
        score: 1,
        message:
          "Override permission revoked. Human intervention no longer trusted."
      });
    }

    // ⚠️ Conditional permission
    if (overrideCount >= 2 || trustScore < 0.6) {
      return engineResult({
        engine: "AdsCode38_Permission",
        status: "WARNING",
        score: 0.7,
        message:
          "Override permission restricted. System recommendations should be followed."
      });
    }

    // ✅ Permission granted
    return engineResult({
      engine: "AdsCode38_Permission",
      status: "PASS",
      score: 0.3,
      message: "Human override permission valid."
    });
  }
}

module.exports = { PermissionEngine };
