module.exports = function dataSanityGuard(metrics = {}) {
  const required = ["ctr", "cpa", "roas"];

  for (const key of required) {
    if (typeof metrics[key] !== "number") {
      return { ok: false, reason: "INVALID_METRIC_TYPE" };
    }
    if (metrics[key] < 0 || metrics[key] > 100000) {
      return { ok: false, reason: "OUT_OF_RANGE" };
    }
  }

  return { ok: true };
};
