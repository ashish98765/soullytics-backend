/**
 * Simple in-memory learning store
 * (later Supabase / DB se replace kar sakte ho)
 */

const memory = [];

function storeDecision({ metrics, decision, outcome }) {
  memory.push({
    timestamp: Date.now(),
    metrics,
    decision,
    outcome
  });

  if (memory.length > 1000) memory.shift(); // memory cap
}

function getRecentDecisions(limit = 50) {
  return memory.slice(-limit);
}

module.exports = {
  storeDecision,
  getRecentDecisions
};
