// DEPENDENCIES
const AppError = require('../utils/AppError');

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const copyError = (err) => {
  const error = {};
  if (err.name) {
    error.name = err.name;
  }
  if (err.statusCode) {
    error.statusCode = err.statusCode;
  }
  if (err.status) {
    error.status = err.status;
  }
  if (err.message) {
    error.message = err.message;
  }
  if (err.isOperational) {
    error.isOperational = err.isOperational;
  }
  return error;
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

// GLOBAL ERROR HANDLER
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // @TODO: handle ERRORS

  if (process.env.NODE_ENV === 'production') {
    let error = copyError(err);

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(error);
    }

    sendErrorProd(error, res);
  } else {
    sendErrorDev(err, res);
  }
};
