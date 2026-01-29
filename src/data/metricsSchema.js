// src/data/metricsSchema.js

/**
 * Unified Metrics Schema
 * All ad platforms MUST map to this format
 */

module.exports = {
  spend: 0,              // total spend
  impressions: 0,
  clicks: 0,

  ctr: 0,                // %
  cpc: 0,                // cost per click
  cpm: 0,                // cost per 1000 impressions
  roas: 0,               // return on ad spend

  conversions: 0,
  conversionRate: 0,     // %

  frequency: 0,          // avg impressions per user
  reach: 0,

  engagementRate: 0,     // optional
  bounceRate: null,      // optional

  platform: "",          // google | meta
  currency: "INR",

  timeframe: {
    from: null,
    to: null
  }
};
