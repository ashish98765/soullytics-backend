const detectPlatform = require("../detectors/detectPlatform");
const parseMeta = require("../parsers/meta.parser");
const parseGoogle = require("../parsers/google.parser");
const aggregateMetrics = require("../aggregators/aggregateMetrics");

module.exports = function processCSV(rows) {
  const headers = Object.keys(rows[0] || {});
  const platform = detectPlatform(headers);

  if (!platform) {
    throw new Error("UNSUPPORTED_CSV_FORMAT");
  }

  let normalized;

  if (platform === "meta") normalized = parseMeta(rows);
  if (platform === "google") normalized = parseGoogle(rows);

  const aggregated = aggregateMetrics(normalized);

  return {
    platform,
    aggregated,
    rawCount: rows.length
  };
};
