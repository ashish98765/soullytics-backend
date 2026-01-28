// src/core/decisionPersistence.js
const supabase = require("../config/supabaseClient");

/**
 * Resolve user and ensure monthly usage row exists
 */
async function resolveUser(email, plan = "starter") {
  /* 1️⃣ Find user */
  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  /* 2️⃣ Create user if not exists */
  if (!user) {
    const { data: newUser, error: createErr } = await supabase
      .from("users")
      .insert([{ email, plan }])
      .select()
      .single();

    if (createErr) throw createErr;
    user = newUser;
  }

  const month = new Date().toISOString().slice(0, 7);

  /* 3️⃣ Check usage row */
  let { data: usage } = await supabase
    .from("usage_limits")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", month)
    .single();

  /* 4️⃣ Create usage row if not exists */
  if (!usage) {
    const LIMITS = {
      starter: 50,
      growth: 500,
      pro: 5000,
      agency: 999999
    };

    const { error: usageErr } = await supabase
      .from("usage_limits")
      .insert([
        {
          user_id: user.id,
          month,
          used_decisions: 0,
          decision_limit: LIMITS[plan] ?? 50
        }
      ]);

    if (usageErr) throw usageErr;
  }

  return user;
}

module.exports = resolveUser;
