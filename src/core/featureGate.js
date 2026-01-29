const PLAN_FEATURES = {
  starter: {
    reasons: false,
    prescription: false,
    explainability: false
  },
  growth: {
    reasons: true,
    prescription: false,
    explainability: false
  },
  pro: {
    reasons: true,
    prescription: true,
    explainability: false
  },
  agency: {
    reasons: true,
    prescription: true,
    explainability: true
  }
};

function allow(plan, feature) {
  return !!PLAN_FEATURES[plan]?.[feature];
}

module.exports = { allow };
