const { storeDecision } = require("./memoryStore");
const { analyzePatterns } = require("./patternAnalyzer");

function learn({ metrics, decision, outcome }) {
  storeDecision({ metrics, decision, outcome });

  const pattern = analyzePatterns();

  return {
    learningApplied: true,
    detectedPattern: pattern
  };
}

module.exports = { learn };
