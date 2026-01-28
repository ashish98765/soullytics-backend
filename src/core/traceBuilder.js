function buildTrace(engineResults = []) {
  const trace = { passed: [], warnings: [], failed: [] };

  engineResults.forEach(e => {
    if (e.status === "PASS") trace.passed.push(e.engine);
    if (e.status === "WARNING") trace.warnings.push(e.engine);
    if (e.status === "FAIL") trace.failed.push(e.engine);
  });

  return trace;
}

module.exports = { buildTrace };
