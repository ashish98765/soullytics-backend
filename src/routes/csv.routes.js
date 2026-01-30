const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const apiKeyAuth = require("../middlewares/apiKeyAuth");
const DecisionOrchestrator = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");
const supabase = require("../config/supabaseClient");

const router = express.Router();
const upload = multer({ dest: "tmp/" });

router.post(
  "/csv",
  apiKeyAuth,
  upload.single("file"),
  async (req, res) => {
    const { userId, plan } = req.apiUser;
    const { platform } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "CSV_MISSING" });
    }

    const rows = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        fs.unlinkSync(req.file.path);

        const orchestrator = new DecisionOrchestrator(
          Object.values(adsCodeRegistry)
        );

        const decisions = [];

        for (const row of rows) {
          const decision = await orchestrator.run({
            metrics: row,
            context: { userId, plan, platform }
          });

          decisions.push({
            user_id: userId,
            platform,
            action: decision.action,
            confidence: decision.confidence,
            risk: decision.risk,
            reasons: decision.reasons,
            trace: decision.trace
          });
        }

        await supabase.from("decisions").insert(decisions);

        await supabase.from("csv_uploads").insert({
          user_id: userId,
          filename: req.file.originalname,
          row_count: rows.length,
          platform
        });

        return res.json({
          success: true,
          rows: rows.length,
          decisions: decisions.length
        });
      });
  }
);

module.exports = router;
