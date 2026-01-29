// src/core/data/dataGuards.js

function applyDataGuards(metrics) {
  if (!metrics) {
    return {
      ok: false,
      errors: ["NO_METRICS_PROVIDED"]
    };
  }

  const errors = [];

  if (metrics.impressions === 0 && metrics.clicks > 0) {
    errors.push("CLICKS_WITHOUT_IMPRESSIONS");
  }

  if (metrics.spend > 0 && metrics.conversions === 0) {
    errors.push("SPEND_WITHOUT_CONVERSIONS");
  }

  if (metrics.ctr > 0.3) {
    errors.push("ABNORMAL_CTR_SPIKE");
  }

  return {
    ok: errors.length === 0,
    warnings: errors,
    metrics
  };
}

module.exports = applyDataGuards;
