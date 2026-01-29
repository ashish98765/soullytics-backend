const supabase = require("../config/supabaseClient");

async function apiKeyAuth(req, res, next) {
  try {
    const apiKey =
      req.headers["x-api-key"] ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: "API_KEY_MISSING",
      });
    }

    const { data: keyRow, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("api_key", apiKey)
      .eq("status", "active")
      .single();

    if (error || !keyRow) {
      return res.status(401).json({
        success: false,
        error: "INVALID_API_KEY",
      });
    }

    req.apiUser = {
      userId: keyRow.user_id,
      plan: keyRow.plan,
      apiKeyId: keyRow.id,
    };

    next();
  } catch (err) {
    console.error("API KEY AUTH ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "AUTH_FAILED",
    });
  }
}

module.exports = apiKeyAuth;
