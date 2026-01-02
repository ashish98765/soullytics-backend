exports.decide = async (req, res) => {
  try {
    const { goal, budget } = req.body;

    if (!goal || !budget) {
      return res.status(400).json({
        status: "error",
        message: "goal and budget are required"
      });
    }

    let platform = "meta";

    if (goal === "sales" && budget >= 1000) {
      platform = "google";
    }

    res.json({
      status: "success",
      engine: "decision",
      decision: {
        goal,
        budget,
        platform
      }
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Decision engine failed"
    });
  }
};
