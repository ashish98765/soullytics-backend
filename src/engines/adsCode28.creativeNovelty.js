const { engineResult } = require("../core/engineResult");

module.exports = function adsCode28(context = {}) {
  const creativeAgeDays = Number(context.creativeAgeDays || 0);
  const ctrTrend = Number(context.ctrTrend || 0);
  const sameHookCount = Number(context.sameHookCount || 0);

  if (creativeAgeDays > 21 && ctrTrend < -40) {
    return engineResult({
      engine: "AdsCode28_CreativeNovelty",
      status: "FAIL",
      score: 1,
      message: "Creative stale with heavy CTR decay."
    });
  }

  if (creativeAgeDays > 14 || sameHookCount >= 3) {
    return engineResult({
      engine: "AdsCode28_CreativeNovelty",
      status: "WARNING",
      score: 0.6,
      message: "Creative novelty wearing off."
    });
  }

  return engineResult({
    engine: "AdsCode28_CreativeNovelty",
    status: "PASS",
    score: 0.3,
    message: "Creative still fresh."
  });
};
