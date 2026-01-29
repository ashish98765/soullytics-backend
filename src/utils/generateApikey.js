const crypto = require("crypto");

module.exports = function generateApiKey() {
  return "sk_live_" + crypto.randomBytes(24).toString("hex");
};
