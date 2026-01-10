// src/core/decisionOrchestrator.js

const { DecisionEngine } = require("../engines/decision.engine");
const { buildDecisionTrace } = require("./decisionTrace");

// Engines 01–18
const { ObjectiveClarityEngine } = require("../engines/adsCode01.objectiveClarity");
const { BudgetRealityEngine } = require("../engines/adsCode02.budgetReality");
const { PlatformSelectionEngine } = require("../engines/adsCode03.platformSelection");
const { AudienceTemperatureEngine } = require("../engines/adsCode04.audienceTemperature");
const { MessageAudienceMatchEngine } = require("../engines/adsCode05.messageAudienceMatch");
const { HookStrengthEngine } = require("../engines/adsCode06.hookStrength");
const { EmotionalIntensityEngine } = require("../engines/adsCode07.emotionalIntensity");
const { CTAggressionEngine } = require("../engines/adsCode08.ctaAggression");
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

// Final Composer
const { FinalAdsComposer } = require("../engines/adsCode19.finalComposer");

// Intelligence Layer (21–30)
const { RealityCheckEngine } = require("../engines/adsCode21.realityCheck");
const { FeedbackLoopEngine } = require("../engines/adsCode22.feedbackLoop");
const { LearningMemoryEngine } = require("../engines/adsCode23.learningMemory");
const { FunnelIntegrityEngine } = require("../engines/adsCode25.funnelIntegrity");
const { BurnRateEngine } = require("../engines/adsCode26.burnRate");
const { AudienceSaturationEngine } = require("../engines/adsCode27.audienceSaturation");
const { CreativeNoveltyEngine } = require("../engines/adsCode28.creativeNovelty");
const { HumanOverrideRiskEngine } = require("../engines/adsCode29.humanOverrideRisk");
const { FounderRiskProfileEngine } = require("../engines/adsCode30.founderRiskProfile");

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
      CTAggressionEngine,
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

      // Intelligence layer
      RealityCheckEngine,
      FeedbackLoopEngine,
      LearningMemoryEngine,
      FunnelIntegrityEngine,
      BurnRateEngine,
      AudienceSaturationEngine,
      CreativeNoveltyEngine,
      HumanOverrideRiskEngine,
      FounderRiskProfileEngine
    ];

    for (const Engine of engines) {
      const engineInstance = new Engine(context);
      const result = engineInstance.run();
      this.decisionEngine.register(result);
    }

    const baseDecision = this.decisionEngine.resolve();

    const finalComposer = new FinalAdsComposer({
      context,
      baseDecision,
      engineResults: this.decisionEngine.results
    });

    const finalResult = finalComposer.run();

    const trace = buildDecisionTrace(
      [...this.decisionEngine.results, finalResult],
      finalResult.status,
      finalResult.score
    );

    return {
      finalDecision: finalResult.status,
      confidence: finalResult.score,
      trace,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { DecisionOrchestrator };
