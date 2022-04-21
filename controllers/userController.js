// DEPENDENCIES
const User = require('../models/userModel');
//const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// CONTROLLERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({ raw: true });
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!',
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!',
  });
});

exports.updateUserPatch = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!',
  });
});

exports.updateUserPut = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!',
  });
});
