// src/data/normalizers/meta.normalizer.js

function n(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

module.exports = function normalizeMeta(raw = {}) {
  const impressions = n(raw.impressions);
  const clicks = n(raw.clicks);
  const spend = n(raw.spend);
  const purchases = n(raw.purchases);
  const purchase_value = n(raw.purchase_value);

  const ctr = impressions > 0 ? clicks / impressions : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const cpp = purchases > 0 ? spend / purchases : 0;
  const roas = spend > 0 ? purchase_value / spend : 0;

  return {
    impressions,
    clicks,
    spend,
    purchases,
    purchase_value,
    ctr,
    cpc,
    cpp,
    roas
  };
};
