const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = async (err, req, res, next) => {
  try {
    const customError = {
      // set default
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || "Something went wrong try again later",
    };

    if (err.name === "ValidationError") {
      customError.msg = Object.values(err.errors)
        .map((item) => item.message)
        .join(",");
      customError.statusCode = 400;
    }
    if (err.code && err.code === 11000) {
      customError.msg = `Duplicate value entered for ${Object.keys(
        err.keyValue
      )} field, please choose another value`;
      customError.statusCode = 400;
      console.log(Object.values(err.errors));
    }
    if (err.name === "CastError") {
      customError.msg = `No item found with id : ${err.value}`;
      customError.statusCode = 404;
    }

    res.status(customError.statusCode).json({ msg: customError.msg });
    next();
  } catch (err) {
    console.log({ msg: err.message });
    res.status(500).json({ msg: err.message });
  }
};

module.exports = errorHandlerMiddleware;
