// src/engines/adsCode35.dataReliability.js

const { engineResult } = require("../core/engineResult");

class DataReliabilityEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const ctr = Number(this.context.ctr || 0);
    const clicks = Number(this.context.clicks || 0);
    const impressions = Number(this.context.impressions || 0);
    const conversions = Number(this.context.conversions || 0);
    const spend = Number(this.context.spend || 0);

    // ❌ Impossible CTR
    if (ctr > 40) {
      return engineResult({
        engine: "AdsCode35_DataReliability",
        status: "FAIL",
        score: 1,
        message: "CTR unrealistically high. Data likely corrupted or bot-driven."
      });
    }

    // ❌ Clicks without impressions
    if (clicks > 0 && impressions === 0) {
      return engineResult({
        engine: "AdsCode35_DataReliability",
        status: "FAIL",
        score: 1,
        message: "Clicks recorded without impressions. Tracking broken."
      });
    }

    // ⚠ Spend but no activity
    if (spend > 0 && clicks === 0 && impressions === 0) {
      return engineResult({
        engine: "AdsCode35_DataReliability",
        status: "WARNING",
        score: 0.7,
        message: "Spend recorded with no traffic signals. Verify tracking setup."
      });
    }

    // ⚠ Conversions without clicks
    if (conversions > 0 && clicks === 0) {
      return engineResult({
        engine: "AdsCode35_DataReliability",
        status: "WARNING",
        score: 0.6,
        message: "Conversions detected without clicks. Attribution mismatch possible."
      });
    }

    // ✅ Data looks sane
    return engineResult({
      engine: "AdsCode35_DataReliability",
      status: "PASS",
      score: 0.3,
      message: "Input data signals appear reliable."
    });
  }
}

module.exports = { DataReliabilityEngine };
