// src/core/contextBuilder.js

/**
 * Builds a normalized context for all engines
 */

function buildContext(input) {
  return {
    objective: input.objective || null,
    budget: Number(input.budget) || 0,
    platform: input.platform || null,
    audienceType: input.audienceType || "UNKNOWN",
    creatives: input.creatives || [],
    historicalData: input.historicalData || null,
    mode: input.mode || null,

    meta: {
      receivedAt: new Date().toISOString(),
      source: input.source || "API"
    }
  };
}

module.exports = { buildContext };
