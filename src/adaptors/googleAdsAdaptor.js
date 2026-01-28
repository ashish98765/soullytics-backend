class GoogleAdsAdapter {
  static adapt(raw) {
    return {
      account: {
        platform: "google_ads",
        accountId: raw.customer_id,
        currency: raw.currency
      },

      campaign: {
        id: raw.campaign.id,
        objective: raw.campaign.objective,
        dailyBudget: raw.campaign.budget,
        spentToday: raw.metrics.cost,
        status: raw.campaign.status
      },

      performance: {
        impressions: raw.metrics.impressions,
        clicks: raw.metrics.clicks,
        ctr: raw.metrics.ctr,
        conversions: raw.metrics.conversions,
        cpa: raw.metrics.cpa,
        roas: raw.metrics.roas
      },

      creatives: raw.creatives || [],

      audience: raw.audience || {},

      history: raw.history || {},

      system: {
        riskTolerance: raw.riskTolerance || "MEDIUM"
      }
    };
  }
}

module.exports = GoogleAdsAdapter;
