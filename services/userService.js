// DEPENDENCIES
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

// USER SERVICES
exports.findAllUsers = async () => await User.findAll({ raw: true });

exports.findUserByUsername = async (username) => {
  const user = await User.findOne({ where: { username }, raw: true });

  if (!user) {
    throw new AppError('No user found with that username', 404);
  }

  return user;
};

exports.updateUserByUsername = async (info, username) => {
  await User.update(info, {
    where: { username },
  });
};

exports.deleteUserByUsername = async (username) => {
  await User.destroy({ where: { username } });
};

exports.isSameUser = async (id, username) => {
  const user = await User.findOne({ where: { username: id }, raw: true });

  if (!user) {
    throw new AppError('No user found with that username', 404);
  }

  if (user.username !== username) {
    throw new AppError('You do not have permission!', 403);
  }
};
