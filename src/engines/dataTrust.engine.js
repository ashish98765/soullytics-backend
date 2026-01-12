// src/engines/dataTrust.engine.js

/**
 * Data Trust Engine
 * -----------------
 * Validates whether incoming data is reliable enough
 * to make automated decisions.
 */

function run(context = {}) {
  const metrics = context.metrics || {};

  const requiredMetrics = ["ctr", "cpc", "cpa", "roas"];
  const missing = requiredMetrics.filter(
    (key) => metrics[key] === undefined || metrics[key] === null
  );

  if (missing.length > 0) {
    return {
      trusted: false,
      reason: `Missing metrics: ${missing.join(", ")}`
    };
  }

  // basic sanity checks
  if (
    metrics.ctr <= 0 ||
    metrics.cpc <= 0 ||
    metrics.cpa <= 0
  ) {
    return {
      trusted: false,
      reason: "Invalid metric values"
    };
  }

  return {
    trusted: true,
    confidence: "HIGH"
  };
}

module.exports = {
  run
};
