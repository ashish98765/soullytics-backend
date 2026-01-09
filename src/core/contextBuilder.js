// src/core/contextBuilder.js

/**
 * Context Builder
 * Converts raw API input into engine-safe context
 */

function buildContext(raw = {}) {
  return {
    objective: normalizeObjective(raw.objective),
    budget: normalizeBudget(raw.budget),
    platform: normalizePlatform(raw.platform),
    audience: normalizeAudience(raw.audience),
    creatives: Array.isArray(raw.creatives) ? raw.creatives : [],
    historicalData: raw.historicalData || null,
    riskTolerance: raw.riskTolerance || "MEDIUM",
    timestamp: new Date().toISOString()
  };
}

/* ---------- Normalizers ---------- */

function normalizeObjective(value) {
  if (!value) return null;
  return String(value).toUpperCase();
}

function normalizeBudget(value) {
  const num = Number(value);
  if (isNaN(num) || num <= 0) return 0;
  return num;
}

function normalizePlatform(value) {
  if (!value) return null;
  return String(value).toLowerCase();
}

function normalizeAudience(value) {
  if (!value || typeof value !== "object") return {};
  return {
    temperature: value.temperature || "COLD",
    size: value.size || "UNKNOWN",
    geo: value.geo || "GLOBAL"
  };
}

module.exports = { buildContext };
