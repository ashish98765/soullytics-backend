// src/core/prescriptionGenerator.js

function generatePrescription({ action, trace }) {
  const steps = [];

  if (!trace || !trace.engines) {
    return {
      summary: "Not enough data to generate prescription",
      steps: []
    };
  }

  const highIssues = trace.engines.filter(e => e.severity === "HIGH");
  const mediumIssues = trace.engines.filter(e => e.severity === "MEDIUM");

  if (action === "PAUSE" || action === "KILL") {
    steps.push({
      priority: 1,
      title: "Stop or pause ads",
      description: "Prevent further losses before making changes"
    });
  }

  highIssues.forEach(issue => {
    steps.push({
      priority: 2,
      title: `Fix ${issue.group.toLowerCase()} issue`,
      description: issue.message
    });
  });

  mediumIssues.forEach(issue => {
    steps.push({
      priority: 3,
      title: `Improve ${issue.group.toLowerCase()}`,
      description: issue.message
    });
  });

  if (action === "SCALE") {
    steps.push({
      priority: 1,
      title: "Increase budget gradually",
      description: "Scale in 10–20% increments and monitor CPA"
    });
  }

  return {
    summary:
      action === "SCALE"
        ? "Campaign is ready to scale safely"
        : action === "RUN"
        ? "Campaign is stable and can continue"
        : action === "PAUSE"
        ? "Campaign paused to fix critical issues"
        : "Campaign stopped to avoid losses",

    steps: steps.sort((a, b) => a.priority - b.priority)
  };
}

module.exports = generatePrescription;
