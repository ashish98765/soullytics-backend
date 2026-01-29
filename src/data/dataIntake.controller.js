// src/data/dataIntake.controller.js

const googleNormalizer = require("./normalizers/google.normalizer");
const metaNormalizer = require("./normalizers/meta.normalizer");
const openAdsNormalizer = require("./normalizers/openAds.normalizer");

module.exports = function dataIntakeController({ platform, raw }) {
  try {
    let normalized;

    switch (platform) {
      case "google":
        normalized = googleNormalizer(raw);
        break;

      case "meta":
        normalized = metaNormalizer(raw);
        break;

      case "openAds": // 👈 NOT adsterra
        normalized = openAdsNormalizer(raw);
        break;

      default:
        return {
          ok: false,
          errors: [`Unsupported platform: ${platform}`]
        };
    }

    if (!normalized.ok) {
      return normalized;
    }

    return {
      ok: true,
      metrics: normalized.metrics
    };

  } catch (err) {
    return {
      ok: false,
      errors: [err.message]
    };
  }
};
