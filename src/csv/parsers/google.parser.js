module.exports = function parseGoogle(rows) {
  return rows.map(row => ({
    spend: Number(row.Cost || 0),
    impressions: Number(row.Impressions || 0),
    clicks: Number(row.Clicks || 0),
    conversions: Number(row.Conversions || 0),
    date: row.Date
  }));
};
