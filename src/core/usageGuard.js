const supabase = require("../config/supabaseClient");

async function checkUsageLimit(user) {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM

  const { data: usage, error } = await supabase
    .from("usage_limits")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", month)
    .single();

  if (error || !usage) {
    throw new Error("Usage record missing");
  }

  if (usage.decisions_used >= usage.decision_limit) {
    return {
      allowed: false,
      message: "Monthly decision limit reached. Upgrade your plan."
    };
  }

  return { allowed: true };
}

module.exports = checkUsageLimit;
