const express = require("express");
const router = express.Router();

const supabase = require("../config/supabaseClient");

/**
 * GET /api/analytics?userId=xxx
 */
router.get("/analytics", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "USER_ID_REQUIRED"
      });
    }

    const { data: decisions, error } = await supabase
      .from("decisions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const summary = {
      total: decisions.length,
      scale: decisions.filter(d => d.action === "SCALE").length,
      run: decisions.filter(d => d.action === "RUN").length,
      pause: decisions.filter(d => d.action === "PAUSE").length,
      kill: decisions.filter(d => d.action === "KILL").length,
    };

    res.json({
      success: true,
      summary,
      recent: decisions
    });

  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(500).json({
      success: false,
      error: "ANALYTICS_FAILED"
    });
  }
});

module.exports = router;
