const notFound = async (err, req, res, next) => {
  try {
    await res.status(404).send("Route does not exist");
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = notFound;
