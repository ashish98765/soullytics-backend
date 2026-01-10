// src/core/decisionOrchestrator.js

/**
 * Soullytics Decision Orchestrator
 * Runs Ads Decision Engines 01–23 in strict order
 * Returns FINAL, NON-EMOTIONAL decision
 */

const { DecisionEngine } = require("../engines/decision.engine");

// Engines 01–18
const { ObjectiveClarityEngine } = require("../engines/adsCode01.objectiveClarity");
const { BudgetRealityEngine } = require("../engines/adsCode02.budgetReality");
const { PlatformSelectionEngine } = require("../engines/adsCode03.platformSelection");
const { AudienceTemperatureEngine } = require("../engines/adsCode04.audienceTemperature");
const { MessageAudienceMatchEngine } = require("../engines/adsCode05.messageAudienceMatch");
const { HookStrengthEngine } = require("../engines/adsCode06.hookStrength");
const { EmotionalIntensityEngine } = require("../engines/adsCode07.emotionalIntensity");
const { CTAAggressionEngine } = require("../engines/adsCode08.ctaAggression");
const { CreativeFormatEngine } = require("../engines/adsCode09.creativeFormat");
const { PlatformRulesEngine } = require("../engines/adsCode10.platformRules");
const { TestingStrategyEngine } = require("../engines/adsCode11.testingStrategy");
const { BudgetSplitEngine } = require("../engines/adsCode12.budgetSplit");
const { CreativeFatigueEngine } = require("../engines/adsCode13.creativeFatigue");
const { PerformanceExpectationEngine } = require("../engines/adsCode14.performanceExpectation");
const { RiskDetectionEngine } = require("../engines/adsCode15.riskDetection");
const { ScalingReadinessEngine } = require("../engines/adsCode16.scalingReadiness");
const { PlatformBiasEngine } = require("../engines/adsCode17.platformBias");
const { StopLossEngine } = require("../engines/adsCode18.stopLoss");

// Engine 19
const { FinalAdsComposer } = require("../engines/adsCode19.finalComposer");

// Engines 21–23 (INTELLIGENCE LAYER)
const { RealityCheckEngine } = require("../engines/adsCode21.realityCheck");
const { FeedbackLoopEngine } = require("../engines/adsCode22.feedbackLoop");
const { LearningMemoryEngine } = require("../engines/adsCode23.learningMemory");

class DecisionOrchestrator {
  constructor() {
    this.decisionEngine = new DecisionEngine();
  }

  run(context) {
    this.decisionEngine.reset();

    const engines = [
      ObjectiveClarityEngine,
      BudgetRealityEngine,
      PlatformSelectionEngine,
      AudienceTemperatureEngine,
      MessageAudienceMatchEngine,
      HookStrengthEngine,
      EmotionalIntensityEngine,
      CTAAggressionEngine,
      CreativeFormatEngine,
      PlatformRulesEngine,
      TestingStrategyEngine,
      BudgetSplitEngine,
      CreativeFatigueEngine,
      PerformanceExpectationEngine,
      RiskDetectionEngine,
      ScalingReadinessEngine,
      PlatformBiasEngine,
      StopLossEngine,

      // Intelligence & learning
      RealityCheckEngine,
      FeedbackLoopEngine,
      LearningMemoryEngine,
    ];

    // Run engines 01–18 + 21–23
    for (const Engine of engines) {
      const engineInstance = new Engine(context);
      const result = engineInstance.run();
      this.decisionEngine.register(result);
    }

    // Resolve base decision
    const baseDecision = this.decisionEngine.resolve();

    // Final Composer (19)
    const finalComposer = new FinalAdsComposer({
      context,
      baseDecision,
      engineResults: this.decisionEngine.results,
    });

    const finalResult = finalComposer.run();

    return {
      finalDecision: finalResult.status, // RUN | PAUSE | DO_NOT_RUN
      confidence: finalResult.score || null,
      message: finalResult.message,
      evaluatedEngines: this.decisionEngine.results.length,
      engineResults: [...this.decisionEngine.results, finalResult],
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = { DecisionOrchestrator };
