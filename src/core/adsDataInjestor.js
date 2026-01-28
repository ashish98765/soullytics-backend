// src/core/adsDataIngestor.js

async function ingestAdsData(raw = {}) {
  // abhi manual / mock data allow kar rahe hain
  // future me yahin Google Ads / Meta Ads API connect hogi

  if (!raw.adsMetrics) {
    return {
      available: false,
      reason: "Ads account not connected",
    };
  }

  const m = raw.adsMetrics;

  return {
    available: true,
    platform: m.platform || "unknown",
    spend: Number(m.spend || 0),
    impressions: Number(m.impressions || 0),
    clicks: Number(m.clicks || 0),
    ctr: m.impressions ? m.clicks / m.impressions : 0,
    conversions: Number(m.conversions || 0),
    cpa: m.conversions ? m.spend / m.conversions : null,
    roas: Number(m.roas || 0),
    window: m.window || "7d",
    fetchedAt: new Date().toISOString(),
  };
}

module.exports = ingestAdsData;
