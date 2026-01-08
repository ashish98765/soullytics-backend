// src/controllers/soullytics.controller.js

async function handleSoullytics(req, res) {
  try {
    const input = req.body || {};

    return res.status(200).json({
      status: "OK",
      message: "Soullytics backend is alive",
      receivedInput: input
    });
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      error: err.message
    });
  }
}

module.exports = {
  handleSoullytics
};
