const supabase = require("../config/supabaseClient");

async function resolveCampaign({ userId, campaign }) {
  if (!campaign || (!campaign.id && !campaign.name)) return null;

  // 1. If ID provided, trust it
  if (campaign.id) {
    return { id: campaign.id };
  }

  // 2. Else find by name + user
  let { data: existing } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", userId)
    .eq("name", campaign.name)
    .single();

  if (existing) return existing;

  // 3. Create new campaign
  const { data: created, error } = await supabase
    .from("campaigns")
    .insert([
      {
        user_id: userId,
        name: campaign.name,
        platform: campaign.platform || "unknown"
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return created;
}

module.exports = resolveCampaign;
