// DEPENDENCIES
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const { serveData } = require('../utils/contentNegotiation');

// CONTROLLERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.findAllUsers();

  serveData(users, 200, req, res, next);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userService.findUserByUsername(req.params.username);

  serveData(user, 200, req, res, next);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  await userService.isSameUser(req.params.username, req.user.username);

  const info = {};
  if (req.body.name) {
    info.name = req.body.name;
  }

  await userService.updateUserByUsername(info, req.params.username);

  const updatedUser = await userService.findUserByUsername(req.params.username);

  serveData(updatedUser, 200, req, res, next);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await userService.isSameUser(req.params.username, req.user.username);

  await userService.deleteUserByUsername(req.params.username);

  serveData(null, 204, req, res, next);
});
