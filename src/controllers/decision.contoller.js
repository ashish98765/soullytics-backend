exports.decide = (req, res) => {
  console.log("DECISION HIT", req.body); // DEBUG LINE

  const { goal, budget } = req.body;

  if (!goal || !budget) {
    return res.status(400).json({
      status: "error",
      message: "goal and budget required"
    });
  }

  let platform = "meta";
  if (budget >= 1000) platform = "google";

  res.json({
    status: "success",
    engine: "decision",
    decision: { goal, budget, platform }
  });
};
