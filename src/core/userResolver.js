const supabase = require("../config/supabaseClient");

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

async function resolveUser(email) {
  // 1. Check user
  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // 2. Create user if not exists
  if (!user) {
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ email }])
      .select()
      .single();

    if (error) throw error;
    user = newUser;
  }

  const month = getCurrentMonth();

  // 3. Check usage row
  let { data: usage } = await supabase
    .from("usage_limits")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", month)
    .single();

  // 4. Create usage row if not exists
  if (!usage) {
    const limitMap = {
      starter: 10,
      growth: 50,
      pro: 999999,
      agency: 999999
    };

    const { error } = await supabase.from("usage_limits").insert([
      {
        user_id: user.id,
        month,
        decision_limit: limitMap[user.plan] || 10
      }
    ]);

    if (error) throw error;
  }

  return user;
}

module.exports = resolveUser;
