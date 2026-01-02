exports.createGoogleAd = ({ objective, budget }) => {
  return {
    platform: "google",
    creative: {
      headline: "Grow Your Business Fast",
      description: "Intent-based leads from Google search"
    }
  };
};
