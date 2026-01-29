const supabase = require("../config/supabaseClient");

const PLAN_LIMITS = {
  free: 2,        // 2 ads free
  starter: 50,
  pro: 500,
  agency: 1000000
};

async function usageGuard(user) {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const limit = PLAN_LIMITS[user.plan] ?? 0;

  // 1. Fetch or create usage row
  let { data: usage, error } = await supabase
    .from("usage_limits")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", month)
    .single();

  if (!usage) {
    const { data: created } = await supabase
      .from("usage_limits")
      .insert({
        user_id: user.id,
        month,
        decisions_used: 0
      })
      .select()
      .single();

    usage = created;
  }

  // 2. Check limit
  if (usage.decisions_used >= limit) {
    return {
      allowed: false,
      used: usage.decisions_used,
      limit,
      remaining: 0
    };
  }

  // 3. Increment usage
  await supabase
    .from("usage_limits")
    .update({
      decisions_used: usage.decisions_used + 1,
      updated_at: new Date()
    })
    .eq("id", usage.id);

  return {
    allowed: true,
    used: usage.decisions_used + 1,
    limit,
    remaining: limit - (usage.decisions_used + 1)
  };
}

module.exports = usageGuard;
