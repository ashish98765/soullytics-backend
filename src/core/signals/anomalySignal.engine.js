// src/core/signals/anomalySignal.engine.js

module.exports = {
  name: "AnomalySignal",

  run({ metrics }) {
    let status = "PASS";
    let risk = 0;
    let confidence = 0.9;
    let message = "No anomalies detected";

    if (metrics.spend > 0 && metrics.conversions === 0) {
      status = "FAIL";
      risk = 0.9;
      confidence = 0.95;
      message = "Spend happening without conversions";
    }

    if (metrics.ctr > 0.25) {
      status = "WARNING";
      risk = 0.6;
      confidence = 0.85;
      message = "Unusual CTR spike detected";
    }

    return {
      engine: "AnomalySignal",
      status,
      risk,
      confidence,
      message
    };
  }
};
