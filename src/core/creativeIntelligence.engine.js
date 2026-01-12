const { HookStrengthEngine } = require("../adsCode06.hookStrength");
const { EmotionalIntensityEngine } = require("../adsCode07.emotionalIntensity");
const { CreativeFatigueEngine } = require("../adsCode13.creativeFatigue");
const { CreativeNoveltyEngine } = require("../adsCode28.creativeNovelty");

class CreativeIntelligenceEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    return [
      new HookStrengthEngine(this.context).run(),
      new EmotionalIntensityEngine(this.context).run(),
      new CreativeFatigueEngine(this.context).run(),
      new CreativeNoveltyEngine(this.context).run()
    ];
  }
}

module.exports = { CreativeIntelligenceEngine };
