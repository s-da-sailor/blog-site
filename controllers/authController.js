// DEPENDENCIES
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const contentNegotiation = require('../utils/contentNegotiation');

exports.signToken = (username) =>
  jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.createAndSendToken = (user, statusCode, req, res, next) => {
  const token = exports.signToken(user.username);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'strict',
  };
  //if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.clearCookie('jabcookie');
  res.cookie('jabcookie', token, cookieOptions);

  contentNegotiation.serveData(user, 200, req, res, next);
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username, name, email, password, passwordConfirm } = req.body;
  const newUser = await userService.createUser({
    username,
    name,
    email,
    password,
    passwordConfirm,
  });

  delete newUser.dataValues.password;
  delete newUser.dataValues.passwordConfirm;

  exports.createAndSendToken(newUser.dataValues, 201, req, res, next);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1. Check if username and password exist in req body
  if (!username || !password) {
    return next(new AppError('Please provide username and password', 400));
  }

  // 2. Check if user exists in DB and password is correct
  const user = await userService.findUserByUsernameWithPassword(username);

  if (
    !(await userService.correctPassword(password, user.dataValues.password))
  ) {
    return next(new AppError('Incorrect email or password', 401));
  }

  delete user.dataValues.password;

  // 3. Send token to client
  exports.createAndSendToken(user.dataValues, 200, req, res, next);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie('jabcookie');
  contentNegotiation.serveData(null, 204, req, res, next);
});

exports.verify = catchAsync(async (req, res, next) => {
  if (req.user) contentNegotiation.serveData(req.user, 200, req, res, next);
  else contentNegotiation.serveData(null, 200, req, res, next);
});
