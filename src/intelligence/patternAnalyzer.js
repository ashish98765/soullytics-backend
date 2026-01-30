const { getRecentDecisions } = require("./memoryStore");

function analyzePatterns() {
  const history = getRecentDecisions(100);

  if (history.length < 10) return null;

  let killCount = 0;
  let pauseCount = 0;

  for (const h of history) {
    if (h.decision === "KILL") killCount++;
    if (h.decision === "PAUSE") pauseCount++;
  }

  return {
    instability:
      killCount / history.length > 0.3 ||
      pauseCount / history.length > 0.5,
    sampleSize: history.length
  };
}

module.exports = { analyzePatterns };
