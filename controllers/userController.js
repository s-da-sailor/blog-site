// DEPENDENCIES
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const contentNegotiation = require('../utils/contentNegotiation');
const AppError = require('../utils/AppError');
const authController = require('./authController');

// CONTROLLERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.findAllUsers();
  contentNegotiation.serveData(users, 200, req, res, next);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userService.findUserByUsername(req.params.username);

  contentNegotiation.serveData(user, 200, req, res, next);
});

exports.updateUserPatch = catchAsync(async (req, res, next) => {
  await userService.isSameUser(req.params.username, req.user.username);

  const info = {};
  if (req.body.name) {
    info.name = req.body.name;
  }
  if (req.body.email) {
    info.email = req.body.email;
  }
  if (req.body.password || req.body.passwordConfirm) {
    info.password = req.body.password;
    info.passwordConfirm = req.body.passwordConfirm;
    info.passwordChangedAt = new Date();
  }

  await userService.updateUserByUsername(info, req.params.username);

  const updatedUser = await userService.findUserByUsername(req.params.username);

  if (updatedUser && info.password) {
    authController.createAndSendToken(updatedUser, 200, req, res, next);
  } else {
    contentNegotiation.serveData(updatedUser, 200, req, res, next);
  }
});

exports.updateUserPut = catchAsync(async (req, res, next) => {
  await userService.isSameUser(req.params.username, req.user.username);

  const info = {};

  info.name = req.body.name || '';
  info.email = req.body.email || '';
  info.password = req.body.password || '';
  info.passwordConfirm = req.body.passwordConfirm || '';
  info.passwordChangedAt = new Date();

  if (!info.name || !info.email || !info.password || !info.passwordConfirm) {
    return next(
      new AppError(
        'Please provide a new name, email, password and confirm password',
        400
      )
    );
  }

  await userService.updateUserByUsername(info, req.params.username);

  const updatedUser = await userService.findUserByUsername(req.params.username);

  authController.createAndSendToken(updatedUser, 200, req, res, next);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await userService.isSameUser(req.params.username, req.user.username);

  await userService.deleteUserByUsername(req.params.username);

  contentNegotiation.serveData(null, 204, req, res, next);
});
