async function handleSoullytics(req, res) {
  return res.status(200).json({
    status: "OK",
    message: "Soullytics backend is alive"
  });
}

module.exports = { handleSoullytics };
