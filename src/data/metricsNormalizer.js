// src/data/metricsNormalizer.js

/**
 * Metrics Normalizer & Validator
 * Final gate before engines consume data
 */

function normalizeMetrics(metrics) {
  if (!metrics) {
    throw new Error("Metrics object missing");
  }

  const errors = [];

  // Basic sanity checks
  if (metrics.spend < 0) errors.push("Invalid spend");
  if (metrics.impressions < 0) errors.push("Invalid impressions");
  if (metrics.clicks < 0) errors.push("Invalid clicks");
  if (metrics.ctr < 0 || metrics.ctr > 100) errors.push("CTR out of range");
  if (metrics.roas < 0) errors.push("Invalid ROAS");

  // Logical consistency
  if (metrics.impressions === 0 && metrics.clicks > 0) {
    errors.push("Clicks without impressions");
  }

  if (metrics.clicks === 0 && metrics.conversions > 0) {
    errors.push("Conversions without clicks");
  }

  // Normalize optional fields
  const normalized = {
    ...metrics,
    reach: metrics.reach ?? metrics.impressions,
    frequency:
      metrics.frequency ??
      (metrics.reach ? metrics.impressions / metrics.reach : null)
  };

  return {
    valid: errors.length === 0,
    errors,
    metrics: normalized
  };
}

module.exports = normalizeMetrics;
