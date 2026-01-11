function normalizeGoogleAds(raw) {
  return {
    platform: "google",

    campaign: {
      type: raw.campaignType || "SEARCH",
      objective: raw.objective || "CONVERSIONS",
      daysRunning: Number(raw.daysRunning || 1)
    },

    delivery: {
      impressions: Number(raw.impressions || 0),
      clicks: Number(raw.clicks || 0),
      ctr: Number(raw.ctr || 0),
      frequency: Number(raw.frequency || 1)
    },

    cost: {
      spend: Number(raw.spend || 0),
      cpc: Number(raw.cpc || 0),
      dailyBudget: Number(raw.dailyBudget || 0)
    },

    performance: {
      conversions: Number(raw.conversions || 0),
      cpa: Number(raw.cpa || 0),
      conversionRate: Number(raw.conversionRate || 0)
    },

    signals: {
      ctrTrend: Number(raw.ctrTrend || 0),
      volatility: raw.volatility || "LOW"
    },

    // engines ke liye direct signals
    creativeAgeDays: Number(raw.creativeAgeDays || 0),
    sameHookCount: Number(raw.sameHookCount || 0),
    overrideCount: Number(raw.overrideCount || 0)
  };
}

module.exports = { normalizeGoogleAds };
