// DEPENDENCIES
const { promisify } = require('util');
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
  };
  //if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.token = token;

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

// For getting access to the protected routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1. If token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in again.', 401)
    );
  }

  // 2. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const freshUser = await userService.findUserByUsernameInstance(
    decoded.username
  );

  if (!freshUser) {
    return next(
      new AppError('The user belonging to the token no longer exists!', 401)
    );
  }

  // 4. If user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recenty changed password! Please log in again.', 401)
    );
  }

  // 5. Grant acess to protected route
  req.user = freshUser.dataValues;
  next();
});
