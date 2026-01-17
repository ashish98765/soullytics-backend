function engineResult({
  engine,
  status,
  score = null,
  message = "",
  meta = {}
}) {
  return {
    engine,
    status,
    score,
    message,
    meta,
    timestamp: new Date().toISOString()
  };
}

module.exports = { engineResult };
