// src/data/normalizers/google.normalizer.js

function n(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

module.exports = function normalizeGoogle(raw = {}) {
  const impressions = n(raw.impressions);
  const clicks = n(raw.clicks);
  const spend = n(raw.spend);
  const conversions = n(raw.conversions);
  const revenue = n(raw.revenue);

  const ctr = impressions > 0 ? clicks / impressions : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const cpa = conversions > 0 ? spend / conversions : 0;
  const roas = spend > 0 ? revenue / spend : 0;

  return {
    impressions,
    clicks,
    spend,
    conversions,
    revenue,
    ctr,
    cpc,
    cpa,
    roas
  };
};
