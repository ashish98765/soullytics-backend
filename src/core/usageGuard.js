const supabase = require("../config/supabaseClient");

const PLAN_LIMITS = {
  starter: 50,
  growth: 500,
  pro: 5000,
  agency: Infinity,
};

async function checkUsage(userId, plan) {
  const month = new Date().toISOString().slice(0, 7);

  const { data, error } = await supabase
    .from("usage_limits")
    .select("*")
    .eq("user_id", userId)
    .eq("month", month)
    .single();

  if (error || !data) {
    throw new Error("USAGE_RECORD_MISSING");
  }

  const limit = PLAN_LIMITS[plan] ?? 50;

  if (data.used_decisions >= limit) {
    return {
      allowed: false,
      limit,
      used: data.used_decisions,
    };
  }

  return {
    allowed: true,
    limit,
    used: data.used_decisions,
  };
}

module.exports = checkUsage;
