// src/routes/decision.routes.js

const { supabase } = require("../lib/supabaseClient");
const express = require("express");
const router = express.Router();

const { DecisionOrchestrator } = require("../core/decisionOrchestrator");

// ================================
// Ads Decision Codes (1–19)
// ================================
const AdsCode01 = require("../engines/adsCode01.objectiveClarity");
const AdsCode02 = require("../engines/adsCode02.budgetReality");
const AdsCode03 = require("../engines/adsCode03.platformSelection");
const AdsCode04 = require("../engines/adsCode04.audienceTemperature");
const AdsCode05 = require("../engines/adsCode05.messageAudienceMatch");
const AdsCode06 = require("../engines/adsCode06.hookStrength");
const AdsCode07 = require("../engines/adsCode07.emotionalIntensity");
const AdsCode08 = require("../engines/adsCode08.ctaAggression");
const AdsCode09 = require("../engines/adsCode09.creativeFormat");
const AdsCode10 = require("../engines/adsCode10.platformRules");
const AdsCode11 = require("../engines/adsCode11.testingStrategy");
const AdsCode12 = require("../engines/adsCode12.budgetSplit");
const AdsCode13 = require("../engines/adsCode13.creativeFatigue");
const AdsCode14 = require("../engines/adsCode14.performanceExpectation");
const AdsCode15 = require("../engines/adsCode15.riskDetection");
const AdsCode16 = require("../engines/adsCode16.scalingReadiness");
const AdsCode17 = require("../engines/adsCode17.platformBias");
const AdsCode18 = require("../engines/adsCode18.stopLoss");
const AdsCode19 = require("../engines/adsCode19.finalComposer");

// ================================
// DEBUG / INTERNAL DECISION ENDPOINT
// ================================
router.post("/decision/debug", async (req, res) => {
  try {
    const context = req.body || {};

    const orchestrator = new DecisionOrchestrator([
      AdsCode01,
      AdsCode02,
      AdsCode03,
      AdsCode04,
      AdsCode05,
      AdsCode06,
      AdsCode07,
      AdsCode08,
      AdsCode09,
      AdsCode10,
      AdsCode11,
      AdsCode12,
      AdsCode13,
      AdsCode14,
      AdsCode15,
      AdsCode16,
      AdsCode17,
      AdsCode18,
      AdsCode19
    ]);

    const decision = await orchestrator.run(context);

    return res.json({
      success: true,
      mode: "DEBUG",
      decision
    });
  } catch (err) {
    console.error("Decision Debug Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ===============================
// DECISION HISTORY ENDPOINT
// ===============================
router.get("/decision/history", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("decisions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return res.json({
      success: true,
      count: data.length,
      decisions: data,
    });
  } catch (err) {
    console.error("Decision History Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
