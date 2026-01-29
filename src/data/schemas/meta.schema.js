// src/data/schemas/meta.schema.js

module.exports = {
  required: [
    "impressions",
    "clicks",
    "spend",
    "purchases",
    "purchase_value"
  ],
  numeric: [
    "impressions",
    "clicks",
    "spend",
    "purchases",
    "purchase_value",
    "ctr",
    "cpc",
    "cpp",
    "roas"
  ]
};
