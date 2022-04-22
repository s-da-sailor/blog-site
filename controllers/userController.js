// DEPENDENCIES
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { serveData } = require('../utils/contentNegotiation');

// CONTROLLERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({ raw: true });

  serveData(users, 200, req, res, next);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ where: { username }, raw: true });

  if (!user) {
    return next(new AppError('No user found with that username', 404));
  }

  serveData(user, 200, req, res, next);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ where: { username }, raw: true });

  if (!user) {
    return next(new AppError('No user found with this username', 404));
  }
  if (username !== req.user.username) {
    return next(
      new AppError('You do not have permission to update this user', 403)
    );
  }

  const info = {};
  if (req.body.name) {
    info.name = req.body.name;
  }

  await User.update(info, {
    where: { username },
  });

  const updatedUser = await User.findOne({
    where: { username },
    raw: true,
  });

  serveData(updatedUser, 200, req, res, next);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ where: { username }, raw: true });

  if (!user) {
    return next(new AppError('No user found with this username', 404));
  }
  if (username !== req.user.username) {
    return next(
      new AppError('You do not have permission to delete this user', 403)
    );
  }

  await User.destroy({ where: { username } });

  serveData(null, 204, req, res, next);
});
