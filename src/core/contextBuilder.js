// src/core/contextBuilder.js

/**
 * Context Builder
 * Converts raw API input + history into engine-safe context
 */

function buildContext(raw = {}) {
  return {
    // Core inputs
    objective: normalizeUpper(raw.objective),
    budget: normalizeNumber(raw.budget),
    platform: normalizeLower(raw.platform),
    audience: normalizeAudience(raw.audience),
    creatives: Array.isArray(raw.creatives) ? raw.creatives : [],

    // === MEMORY / LEARNING DATA ===
    lastDecision: raw.lastDecision || null,
    historicalDecisions: Array.isArray(raw.historicalDecisions)
      ? raw.historicalDecisions
      : [],

    lastOutcome: raw.lastOutcome || null,
    repeatCount: Number(raw.repeatCount || 0),
    changesApplied: raw.changesApplied === true,
    daysSinceLastDecision: Number(raw.daysSinceLastDecision || 0),

    // Meta
    riskTolerance: raw.riskTolerance || "MEDIUM",
    timestamp: new Date().toISOString(),
  };
}

/* ---------------- Normalizers ---------------- */

function normalizeUpper(value) {
  if (!value) return null;
  return String(value).toUpperCase();
}

function normalizeLower(value) {
  if (!value) return null;
  return String(value).toLowerCase();
}

function normalizeNumber(value) {
  const num = Number(value);
  if (isNaN(num) || num < 0) return 0;
  return num;
}

function normalizeAudience(value) {
  if (!value || typeof value !== "object") return {};
  return {
    temperature: value.temperature || "COLD",
    size: value.size || "UNKNOWN",
    geo: value.geo || "GLOBAL",
  };
}

module.exports = { buildContext };
