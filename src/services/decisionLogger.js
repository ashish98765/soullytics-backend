import supabase from "../config/supabaseClient.js";

export async function logDecision({
  userId,
  campaignId,
  platform,
  decision,
  confidence,
  riskLevel,
  explanation
}) {
  const { data, error } = await supabase
    .from("decision_logs")
    .insert([
      {
        user_id: userId,
        campaign_id: campaignId,
        platform,
        decision,
        confidence,
        risk_level: riskLevel,
        explanation
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
