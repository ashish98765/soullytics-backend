function detectPattern(metrics) {
  const { spend, conversions, ctr } = metrics;

  if (spend > 1000 && conversions < 10) {
    return "HIGH_SPEND_LOW_VOLUME";
  }

  if (ctr < 1 && conversions < 5) {
    return "LOW_ENGAGEMENT_LOW_SIGNAL";
  }

  if (spend > 800 && conversions < 5) {
    return "RISKY_SPEND_PATTERN";
  }

  return "NORMAL_PATTERN";
}

module.exports = { detectPattern };
