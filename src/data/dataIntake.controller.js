// src/data/dataIntake.controller.js

const googleAdsAdapter = require("./googleAds.adapter");
const metaAdsAdapter = require("./metaAds.adapter");
const normalizeMetrics = require("./metricsNormalizer");

/**
 * Data Intake Controller
 * Chooses adapter, validates metrics, returns SAFE metrics
 */
function dataIntakeController({ platform, raw }) {
  if (!platform) {
    throw new Error("Platform missing");
  }

  if (!raw) {
    throw new Error("Raw ads data missing");
  }

  let adaptedMetrics;

  switch (platform) {
    case "google":
      adaptedMetrics = googleAdsAdapter(raw);
      break;

    case "meta":
      adaptedMetrics = metaAdsAdapter(raw);
      break;

    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  const validation = normalizeMetrics(adaptedMetrics);

  if (!validation.valid) {
    return {
      ok: false,
      errors: validation.errors
    };
  }

  return {
    ok: true,
    metrics: validation.metrics
  };
}

module.exports = dataIntakeController;
