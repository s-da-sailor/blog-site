const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (username) =>
  jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user.username);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username, name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    username,
    name,
    email,
    password,
    passwordConfirm,
  });

  delete newUser.dataValues.password;
  delete newUser.dataValues.passwordConfirm;

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1. Check if username and password exist in req body
  if (!username || !password) {
    return next(new AppError('Please provide username and password', 400));
  }

  // 2. Check if user exists in DB and password is correct
  const user = await User.scope('withPassword').findOne({
    where: { username },
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  delete user.dataValues.password;

  // 3. Send token to client
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. If token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
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
  const freshUser = await User.findOne({
    where: { username: decoded.username },
  });

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
