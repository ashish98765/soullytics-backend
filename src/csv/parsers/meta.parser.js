module.exports = function parseMeta(rows) {
  return rows.map(row => ({
    spend: Number(row.spend || 0),
    impressions: Number(row.impressions || 0),
    clicks: Number(row.clicks || 0),
    conversions: Number(row.actions || 0),
    date: row.date_start
  }));
};
