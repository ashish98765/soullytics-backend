// src/core/benchmarkEngine.js

/**
 * Compare user performance with anonymized cohort
 */
function buildBenchmark(userScore, cohortScores = []) {
  if (!cohortScores.length) {
    return {
      percentile: null,
      message: "Not enough benchmark data yet"
    };
  }

  const below = cohortScores.filter(s => s <= userScore).length;
  const percentile = Math.round((below / cohortScores.length) * 100);

  let message = "Average performance";
  if (percentile >= 80) message = "Top performer in similar accounts";
  else if (percentile >= 60) message = "Above average performance";
  else if (percentile >= 40) message = "Stable but improvable";
  else message = "Below average — optimization needed";

  return { percentile, message };
}

module.exports = { buildBenchmark };
