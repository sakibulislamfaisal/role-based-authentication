module.exports = {
  serverError(res, err) {
    res.status(500).json({
      error: err.message || err,
      message: "There was a server side error!",
    });
  },
};
