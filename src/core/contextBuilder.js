// src/core/contextBuilder.js

function buildContext(raw = {}) {
  return {
    /* -------- CORE -------- */
    objective: normalizeUpper(raw.objective),
    platform: normalizeLower(raw.platform),

    /* -------- CAMPAIGN -------- */
    campaign: {
      id: raw.campaignId || null,
      status: raw.status || "UNKNOWN",
      dailyBudget: normalizeNumber(raw.budget),
      spentToday: normalizeNumber(raw.spentToday),
    },

    /* -------- PERFORMANCE -------- */
    performance: {
      impressions: normalizeNumber(raw.impressions),
      clicks: normalizeNumber(raw.clicks),
      ctr: normalizeNumber(raw.ctr),
      conversions: normalizeNumber(raw.conversions),
      cpa: normalizeNumber(raw.cpa),
      roas: normalizeNumber(raw.roas),
    },

    /* -------- ADS METRICS (NEW) -------- */
    adsMetrics: raw.adsMetrics || null,

    /* -------- AUDIENCE -------- */
    audience: normalizeAudience(raw.audience),

    /* -------- CREATIVES -------- */
    creatives: Array.isArray(raw.creatives) ? raw.creatives : [],

    /* -------- HISTORY -------- */
    lastDecision: raw.lastDecision || null,
    historicalDecisions: Array.isArray(raw.historicalDecisions)
      ? raw.historicalDecisions
      : [],

    /* -------- META -------- */
    riskTolerance: raw.riskTolerance || "MEDIUM",
    timestamp: new Date().toISOString(),
  };
}

/* -------- NORMALIZERS -------- */

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
