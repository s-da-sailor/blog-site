const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (username) =>
  jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const { username, name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    username,
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = signToken(newUser.username);

  delete newUser.dataValues.password;
  delete newUser.dataValues.passwordConfirm;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser.dataValues,
    },
  });
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

  // 3. Send token to client
  const token = signToken(user.username);

  res.status(200).json({
    status: 'success',
    token,
  });
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
