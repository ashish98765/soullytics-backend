exports.createGoogleAd = ({ objective, budget }) => {
  return {
    platform: "google",
    creative: {
      headline: "Buy High-Intent Customers Today",
      description: "Get sales-ready users directly from Google Search",
      bidStrategy: "Maximize Conversions"
    }
  };
};
