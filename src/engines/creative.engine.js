// src/engines/creative.engine.js

function generateCreative({ platform, objective }) {
  let headline = "";
  let description = "";
  let cta = "";

  if (platform === "meta" && objective === "leads") {
    headline = "Get More Leads Today";
    description = "High quality leads for your business using smart targeting";
    cta = "Sign Up";
  }

  if (platform === "google" && objective === "leads") {
    headline = "Grow Your Business Faster";
    description = "Reach high intent customers on Google Search";
    cta = "Get Started";
  }

  return {
    headline,
    description,
    cta,
  };
}

module.exports = { generateCreative };
