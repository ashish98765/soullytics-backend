module.exports = function detectPlatform(headers) {
  if (headers.includes("actions")) return "meta";
  if (headers.includes("Conversions")) return "google";
  return null;
};
