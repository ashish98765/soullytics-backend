// src/data/schemas/google.schema.js

module.exports = {
  required: [
    "impressions",
    "clicks",
    "spend",
    "conversions",
    "revenue"
  ],
  numeric: [
    "impressions",
    "clicks",
    "spend",
    "conversions",
    "revenue",
    "ctr",
    "cpc",
    "cpa",
    "roas"
  ]
};
