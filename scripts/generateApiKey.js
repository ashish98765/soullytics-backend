const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generate() {
  const userId = process.argv[2];
  if (!userId) {
    console.error("❌ USER_ID missing");
    process.exit(1);
  }

  const apiKey = "adv_" + crypto.randomBytes(24).toString("hex");

  await supabase.from("api_keys").insert({
    user_id: userId,
    key: apiKey
  });

  await supabase.from("usage_limits").insert({
    user_id: userId,
    plan: "free",
    limit: 50
  });

  console.log("✅ API KEY GENERATED:");
  console.log(apiKey);
}

generate();
