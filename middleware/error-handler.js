const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  let customErr = {
    msg: err.message || 'Something went wrong',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.code && err.code === 11000) {
    (customErr.msg = `${Object.keys(err.keyPattern)} with value ${
      err.keyValue.email
    } already exists`),
      (customErr.statusCode = StatusCodes.BAD_REQUEST);
  }
  if (err.name === 'ValidationError') {
    customErr.msg = Object.values(err.errors)
      .map(el => el.message)
      .join();
    customErr.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === 'CastError') {
    (customErr.msg = `${err.value} is invalid`),
      (customErr.statusCode = StatusCodes.BAD_REQUEST);
  }

  return res.status(customErr.statusCode).json({ msg: customErr.msg });
};

module.exports = errorHandlerMiddleware;
