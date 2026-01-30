function interpret(avgRisk, avgConfidence, pattern) {
  let note = "Stable signal";

  if (pattern !== "NORMAL")
    note = "Pattern historically shows uncertainty";

  return {
    summary: note,
    pattern,
    why: `Risk=${avgRisk}, Confidence=${avgConfidence}`
  };
}

module.exports = { interpret };
