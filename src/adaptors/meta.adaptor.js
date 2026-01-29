module.exports = function normalize(raw) {
  return {
    ctr: raw.inline_link_clicks / Math.max(raw.impressions, 1),
    cpc: raw.spend / Math.max(raw.inline_link_clicks, 1),
    conversions: raw.actions || 0,
    spend: raw.spend,
    impressions: raw.impressions
  };
};
