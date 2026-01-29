const supabase = require("../config/supabaseClient");

module.exports = async function apiKeyAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";

    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "API_KEY_REQUIRED"
      });
    }

    const apiKey = auth.replace("Bearer ", "").trim();

    const { data, error } = await supabase
      .from("api_keys")
      .select("user_id, plan, status")
      .eq("api_key", apiKey)
      .single();

    if (error || !data || data.status !== "active") {
      return res.status(401).json({
        error: "INVALID_API_KEY"
      });
    }

    req.user = {
      id: data.user_id,
      plan: data.plan || "free"
    };

    next();
  } catch (err) {
    return res.status(500).json({
      error: "AUTH_FAILED"
    });
  }
};
