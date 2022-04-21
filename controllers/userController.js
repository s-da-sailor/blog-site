// DEPENDENCIES
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
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
  const { username } = req.params;
  const user = await User.findOne({ where: { username }, raw: true });

  if (!user) {
    return next(new AppError('No user found with that username', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
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

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
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

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
