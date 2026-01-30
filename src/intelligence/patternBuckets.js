function detectPattern(metrics) {
  const { spend, conversions, ctr } = metrics;

  if (spend > 1000 && conversions < 10)
    return "HIGH_SPEND_LOW_SIGNAL";

  if (ctr < 1 && conversions < 5)
    return "LOW_ENGAGEMENT";

  if (spend > 800 && conversions < 5)
    return "BUDGET_RISK";

  return "NORMAL";
}

module.exports = { detectPattern };
