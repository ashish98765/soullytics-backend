const { engineResult } = require("../core/engineResult");

module.exports = function adsCode40(context = {}) {
  const ctr = Number(context.ctr || 0);
  const cpl = Number(context.cpl || 0);
  const industryCTR = Number(context.industryCTR || 1.2);
  const industryCPL = Number(context.industryCPL || 100);

  if (ctr < industryCTR * 0.4 && cpl > industryCPL * 1.8) {
    return engineResult({
      engine: "AdsCode40_RealityAnchor",
      status: "FAIL",
      score: 1,
      message: "Performance detached from market reality."
    });
  }

  if (ctr < industryCTR * 0.7 || cpl > industryCPL * 1.3) {
    return engineResult({
      engine: "AdsCode40_RealityAnchor",
      status: "WARNING",
      score: 0.6,
      message: "Performance deviates from benchmarks."
    });
  }

  return engineResult({
    engine: "AdsCode40_RealityAnchor",
    status: "PASS",
    score: 0.3,
    message: "Performance aligned with market benchmarks."
  });
};
