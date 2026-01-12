const { AudienceTemperatureEngine } = require("../adsCode04.audienceTemperature");
const { AudienceSaturationEngine } = require("../adsCode27.audienceSaturation");
const { MessageAudienceMatchEngine } = require("../adsCode05.messageAudienceMatch");

class AudienceIntelligenceEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    return [
      new AudienceTemperatureEngine(this.context).run(),
      new AudienceSaturationEngine(this.context).run(),
      new MessageAudienceMatchEngine(this.context).run()
    ];
  }
}

module.exports = { AudienceIntelligenceEngine };
