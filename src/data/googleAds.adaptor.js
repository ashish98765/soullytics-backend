// src/data/googleAds.adapter.js

const baseSchema = require("./metricsSchema");

/**
 * Google Ads Adapter
 * Converts raw Google Ads metrics to unified metrics schema
 */
function googleAdsAdapter(raw) {
  if (!raw) {
    throw new Error("Google Ads raw data missing");
  }

  const impressions = Number(raw.impressions || 0);
  const clicks = Number(raw.clicks || 0);
  const spend = Number(raw.cost || 0); // Google usually gives cost in account currency
  const conversions = Number(raw.conversions || 0);
  const revenue = Number(raw.conversionValue || 0);

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
  const roas = spend > 0 ? revenue / spend : 0;
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

  return {
    ...baseSchema,

    platform: "google",

    spend,
    impressions,
    clicks,

    ctr: Number(ctr.toFixed(2)),
    cpc: Number(cpc.toFixed(2)),
    cpm: Number(cpm.toFixed(2)),
    roas: Number(roas.toFixed(2)),

    conversions,
    conversionRate: Number(conversionRate.toFixed(2)),

    reach: raw.reach || null,
    frequency: raw.frequency || null,

    timeframe: {
      from: raw.date_from || null,
      to: raw.date_to || null
    }
  };
}

module.exports = googleAdsAdapter;
