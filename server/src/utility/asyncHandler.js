const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    return res
      .status(error.statusCode||500)
      .json({ success: false, message: error.message });
  }
};

module.exports = asyncHandler;
