// src/data/metaAds.adapter.js

const baseSchema = require("./metricsSchema");

/**
 * Meta Ads Adapter
 * Converts raw Meta (Facebook/Instagram) metrics
 * to unified metrics schema
 */
function metaAdsAdapter(raw) {
  if (!raw) {
    throw new Error("Meta Ads raw data missing");
  }

  const impressions = Number(raw.impressions || 0);
  const clicks = Number(raw.clicks || 0);
  const spend = Number(raw.spend || 0);
  const conversions = Number(raw.conversions || 0);
  const revenue = Number(raw.purchase_value || 0);

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
  const roas = spend > 0 ? revenue / spend : 0;
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

  return {
    ...baseSchema,

    platform: "meta",

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

    engagementRate: raw.engagement_rate
      ? Number(raw.engagement_rate)
      : null,

    timeframe: {
      from: raw.date_start || null,
      to: raw.date_stop || null
    }
  };
}

module.exports = metaAdsAdapter;
