module.exports = function aggregateMetrics(data) {
  const totals = data.reduce(
    (acc, row) => {
      acc.spend += row.spend;
      acc.impressions += row.impressions;
      acc.clicks += row.clicks;
      acc.conversions += row.conversions;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
  );

  const ctr = totals.impressions
    ? (totals.clicks / totals.impressions) * 100
    : 0;

  const cpa = totals.conversions
    ? totals.spend / totals.conversions
    : null;

  const cvr = totals.clicks
    ? (totals.conversions / totals.clicks) * 100
    : 0;

  return {
    ...totals,
    ctr: Number(ctr.toFixed(2)),
    cpa: cpa ? Number(cpa.toFixed(2)) : null,
    conversionRate: Number(cvr.toFixed(2)),
    volume: totals.conversions
  };
};
