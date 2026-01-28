const { engineResult } = require("../core/engineResult");

module.exports = function adsCode22(context = {}) {
  const lastDecision = context.lastDecision || {};
  const lastWarningsCount = Number(lastDecision.warnings_count || 0);
  const lastStatus = lastDecision.final_decision;
  const changesApplied = context.changesApplied === true;
  const daysSinceLastDecision = Number(context.daysSinceLastDecision || 0);

  if (lastWarningsCount > 0 && !changesApplied) {
    return engineResult({
      engine: "AdsCode22_FeedbackLoop",
      status: "FAIL",
      score: 1,
      message: "Warnings ignored. No corrective changes applied."
    });
  }

  if (lastStatus === "PAUSE" && !changesApplied) {
    return engineResult({
      engine: "AdsCode22_FeedbackLoop",
      status: "FAIL",
      score: 1,
      message: "PAUSE decision ignored."
    });
  }

  if (daysSinceLastDecision < 2) {
    return engineResult({
      engine: "AdsCode22_FeedbackLoop",
      status: "WARNING",
      score: 0.6,
      message: "Too early to evaluate feedback loop."
    });
  }

  return engineResult({
    engine: "AdsCode22_FeedbackLoop",
    status: "PASS",
    score: 0.3,
    message: "Feedback loop healthy."
  });
};
