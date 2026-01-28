const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

router.get("/analytics", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "USER_ID_REQUIRED" });
  }

  const { data: decisions } = await supabase
    .from("decisions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  const summary = {
    total: decisions.length,
    scale: decisions.filter(d => d.action === "SCALE").length,
    pause: decisions.filter(d => d.action === "PAUSE").length,
    kill: decisions.filter(d => d.action === "KILL").length
  };

  res.json({
    success: true,
    summary,
    recent: decisions
  });
});

module.exports = router;
