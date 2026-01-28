const { engineResult } = require("../core/engineResult");

module.exports = function adsCode21(context = {}) {
  const ctr = Number(context.ctr || 0);
  const cpc = Number(context.cpc || 0);
  const cpl = Number(context.cpl || 0);
  const conversionRate = Number(context.conversionRate || 0);
  const daysRunning = Number(context.daysRunning || 0);
  const volatility = Number(context.volatility || 0);
  const spendVelocity = Number(context.spendVelocity || 0);

  if (ctr >= 2.5 && conversionRate === 0 && daysRunning >= 3) {
    return engineResult({
      engine: "AdsCode21_RealityCheck",
      status: "FAIL",
      authority: 5,
      score: 0.9,
      message: "High CTR with zero conversions. Traffic illusion detected."
    });
  }

  if (cpl > 0 && cpc > 0 && cpl / cpc > 6) {
    return engineResult({
      engine: "AdsCode21_RealityCheck",
      status: "WARNING",
      authority: 4,
      score: 0.75,
      message: "CPL disproportionately higher than CPC."
    });
  }

  if (daysRunning < 3) {
    return engineResult({
      engine: "AdsCode21_RealityCheck",
      status: "WARNING",
      authority: 2,
      score: 0.55,
      message: "Campaign too new to judge reality."
    });
  }

  if (ctr > 3 && volatility > 0.6) {
    return engineResult({
      engine: "AdsCode21_RealityCheck",
      status: "WARNING",
      authority: 4,
      score: 0.7,
      message: "CTR spike with high volatility."
    });
  }

  if (spendVelocity > 1.5 && conversionRate < 0.5) {
    return engineResult({
      engine: "AdsCode21_RealityCheck",
      status: "FAIL",
      authority: 5,
      score: 0.85,
      message: "Spend accelerating without conversion stability."
    });
  }

  return engineResult({
    engine: "AdsCode21_RealityCheck",
    status: "PASS",
    authority: 2,
    score: 0.3,
    message: "Performance aligns with reality."
  });
};
