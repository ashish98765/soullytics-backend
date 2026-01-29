module.exports = function normalize(raw) {
  return {
    ctr: raw.ctr || 0,
    cpc: raw.cpc || 0,
    conversions: raw.conversions || 0,
    spend: raw.spend || 0,
    impressions: raw.impressions || 0
  };
};
