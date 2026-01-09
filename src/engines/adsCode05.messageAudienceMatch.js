// src/engines/adsCode05.messageAudienceMatch.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class MessageAudienceMatchEngine extends AdsCode {
  run() {
    const audienceType = this.context.audienceType;
    const messageType = this.context.messageType;

    if (!audienceType) {
      return engineResult({
        engine: "AdsCode05_MessageAudienceMatch",
        status: "FAIL",
        message: "Audience type missing. Message relevance cannot be evaluated."
      });
    }

    if (!messageType) {
      return engineResult({
        engine: "AdsCode05_MessageAudienceMatch",
        status: "FAIL",
        message: "Message type missing. System cannot judge message fit."
      });
    }

    const allowedMessagesByAudience = {
      COLD: ["EDUCATIONAL"],
      WARM: ["EDUCATIONAL", "PROBLEM_AWARE"],
      HOT: ["SOLUTION_AWARE", "DIRECT_OFFER"]
    };

    const allowedMessages = allowedMessagesByAudience[audienceType];

    if (!allowedMessages) {
      return engineResult({
        engine: "AdsCode05_MessageAudienceMatch",
        status: "FAIL",
        message: `Audience type '${audienceType}' is not supported.`
      });
    }

    if (!allowedMessages.includes(messageType)) {
      return engineResult({
        engine: "AdsCode05_MessageAudienceMatch",
        status: "FAIL",
        message: `Message type '${messageType}' is not suitable for '${audienceType}' audience.`
      });
    }

    return engineResult({
      engine: "AdsCode05_MessageAudienceMatch",
      status: "PASS",
      score: 0.85,
      message: `Message '${messageType}' matches '${audienceType}' audience readiness.`
    });
  }
}

module.exports = { MessageAudienceMatchEngine };
