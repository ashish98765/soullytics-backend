const supabase = require("../lib/supabaseClient");

async function detectIgnoredAdvice({ campaignId }) {
  const { data, error } = await supabase
    .from("decisions")
    .select("prescription")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;

  let repeated = 0;

  data.forEach(d => {
    if (
      d.prescription &&
      d.prescription.summary &&
      d.prescription.summary.toLowerCase().includes("paused")
    ) {
      repeated++;
    }
  });

  if (repeated >= 3) {
    return {
      severity: "HIGH",
      message: "Same advice ignored multiple times. Escalation required."
    };
  }

  return null;
}

module.exports = detectIgnoredAdvice;
