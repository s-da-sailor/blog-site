// DEPENDENCIES
const AppError = require('../utils/AppError');

const handleUniqueConstraintError = (err) => {
  const message = `Invalid input data. ${err.errors[0].message}`;
  const errorMessage = message.replace('PRIMARY', 'Username');
  return new AppError(errorMessage, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

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
  if (err.errors) {
    error.errors = err.errors;
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

  if (process.env.NODE_ENV === 'production') {
    let error = copyError(err);

    if (error.name === 'SequelizeUniqueConstraintError') {
      error = handleUniqueConstraintError(error);
    }
    if (error.name === 'SequelizeValidationError') {
      error = handleValidationError(error);
    }
    if (error.name === 'JsonWebTokenError') {
      res.clearCookie('jabcookie');
      error = handleJWTError(error);
    }
    if (error.name === 'TokenExpiredError') {
      res.clearCookie('jabcookie');
      error = handleJWTExpiredError(error);
    }

    sendErrorProd(error, res);
  } else {
    sendErrorDev(err, res);
  }
};
