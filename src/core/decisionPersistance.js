const supabase = require("../config/supabaseClient");

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Resolve or create user
 * Also ensures usage_limits row exists
 */
async function resolveUser(email) {
  // 1. Find user
  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // 2. Create user if not exists
  if (!user) {
    const { data: newUser, error: createErr } = await supabase
      .from("users")
      .insert([{ email }])
      .select()
      .single();

    if (createErr) throw createErr;
    user = newUser;
  }

  // 3. Ensure usage row exists
  const month = getCurrentMonth();

  let { data: usage } = await supabase
    .from("usage_limits")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", month)
    .single();

  if (!usage) {
    const planLimits = {
      starter: 10,
      growth: 50,
      pro: 9999,
      agency: 99999
    };

    const limit = planLimits[user.plan] || 10;

    const { error: usageErr } = await supabase
      .from("usage_limits")
      .insert([
        {
          user_id: user.id,
          month,
          decision_limit: limit
        }
      ]);

    if (usageErr) throw usageErr;
  }

  return user;
}

module.exports = resolveUser;
