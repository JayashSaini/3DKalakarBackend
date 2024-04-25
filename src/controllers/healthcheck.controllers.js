const { ApiResponse } = require("../utils/apiResponse.js");

const healthcheck = async (req, res, next) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Server is running perfectly"));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  healthcheck,
};
