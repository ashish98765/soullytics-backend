const { engineResult } = require("../core/engineResult");

module.exports = function adsCode35(context = {}) {
  const ctr = Number(context.ctr || 0);
  const clicks = Number(context.clicks || 0);
  const impressions = Number(context.impressions || 0);
  const conversions = Number(context.conversions || 0);
  const spend = Number(context.spend || 0);

  if (ctr > 40) {
    return engineResult({
      engine: "AdsCode35_DataReliability",
      status: "FAIL",
      score: 1,
      message: "CTR unrealistically high."
    });
  }

  if (clicks > 0 && impressions === 0) {
    return engineResult({
      engine: "AdsCode35_DataReliability",
      status: "FAIL",
      score: 1,
      message: "Clicks without impressions."
    });
  }

  if (spend > 0 && clicks === 0 && impressions === 0) {
    return engineResult({
      engine: "AdsCode35_DataReliability",
      status: "WARNING",
      score: 0.7,
      message: "Spend without traffic signals."
    });
  }

  if (conversions > 0 && clicks === 0) {
    return engineResult({
      engine: "AdsCode35_DataReliability",
      status: "WARNING",
      score: 0.6,
      message: "Conversions without clicks."
    });
  }

  return engineResult({
    engine: "AdsCode35_DataReliability",
    status: "PASS",
    score: 0.3,
    message: "Data signals reliable."
  });
};
