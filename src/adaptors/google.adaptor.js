module.exports = function normalize(raw) {
  return {
    ctr: raw.clicks / Math.max(raw.impressions, 1),
    cpc: raw.cost / Math.max(raw.clicks, 1),
    conversions: raw.conversions,
    spend: raw.cost,
    impressions: raw.impressions
  };
};
