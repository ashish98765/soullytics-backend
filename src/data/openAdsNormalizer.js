// src/core/data/openAdsNormalizer.js

function openAdsNormalizer(raw = {}) {
  const impressions = Number(raw.impressions || 0);
  const clicks = Number(raw.clicks || 0);
  const spend = Number(raw.spend || raw.cost || 0);
  const conversions = Number(raw.conversions || 0);
  const revenue = Number(raw.revenue || 0);

  const safeImpressions = impressions < 0 ? 0 : impressions;
  const safeClicks = clicks < 0 ? 0 : clicks;
  const safeSpend = spend < 0 ? 0 : spend;
  const safeConversions = conversions < 0 ? 0 : conversions;
  const safeRevenue = revenue < 0 ? 0 : revenue;

  const ctr =
    safeImpressions > 0 ? safeClicks / safeImpressions : 0;

  const cpc =
    safeClicks > 0 ? safeSpend / safeClicks : 0;

  const roas =
    safeSpend > 0 ? safeRevenue / safeSpend : 0;

  return {
    impressions: safeImpressions,
    clicks: safeClicks,
    spend: safeSpend,
    conversions: safeConversions,
    revenue: safeRevenue,
    ctr,
    cpc,
    roas,
    timestamp: Date.now()
  };
}

module.exports = openAdsNormalizer;
