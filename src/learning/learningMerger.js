function mergeLearning({ engineTrace, trends, ignored }) {
  const learningSignals = [];

  if (trends && trends.signals) {
    learningSignals.push(...trends.signals);
  }

  if (ignored) {
    learningSignals.push({
      type: "IGNORED_ADVICE",
      severity: ignored.severity,
      message: ignored.message
    });
  }

  return {
    learningSignals,
    hasCriticalLearning:
      learningSignals.filter(s => s.severity === "HIGH").length > 0
  };
}

module.exports = mergeLearning;
