const supabase = require("../lib/supabaseClient");

async function analyzeTrends({ campaignId, limit = 10 }) {
  const { data, error } = await supabase
    .from("decisions")
    .select("action, confidence, risk, created_at")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  if (!data || data.length === 0) return { signals: [] };

  const pauses = data.filter(d => d.action === "PAUSE").length;
  const kills = data.filter(d => d.action === "KILL").length;

  const avgConfidence =
    data.reduce((s, d) => s + (d.confidence || 0), 0) / data.length;

  const avgRisk =
    data.reduce((s, d) => s + (d.risk || 0), 0) / data.length;

  const signals = [];

  if (pauses >= 3) {
    signals.push({
      type: "REPEAT_PAUSE",
      severity: "HIGH",
      message: "Campaign repeatedly paused. Structural issue likely."
    });
  }

  if (kills >= 2) {
    signals.push({
      type: "REPEAT_KILL",
      severity: "HIGH",
      message: "Campaign killed multiple times. Restart strategy required."
    });
  }

  if (avgConfidence < 0.4) {
    signals.push({
      type: "LOW_CONFIDENCE_TREND",
      severity: "MEDIUM",
      message: "Confidence trending low across recent decisions."
    });
  }

  if (avgRisk > 0.65) {
    signals.push({
      type: "HIGH_RISK_TREND",
      severity: "MEDIUM",
      message: "Risk consistently high in recent decisions."
    });
  }

  return { signals };
}

module.exports = analyzeTrends;
