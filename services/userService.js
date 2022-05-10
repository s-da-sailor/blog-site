// DEPENDENCIES
const User = require('../models/userModel');
const throwError = require('../utils/throwError');

// USER SERVICES
exports.findAllUsers = async () => await User.findAll({ raw: true });

exports.findUserByUsername = async (username) => {
  const user = await User.findOne({ where: { username }, raw: true });

  if (!user) {
    throwError.userNotFound();
  }

  return user;
};

exports.findUserByUsernameWithPassword = async (username) => {
  const user = await User.scope('withPassword').findOne({
    where: { username },
  });

  if (!user) {
    throwError.userNotFound();
  }

  return user;
};

exports.createUser = async (info) => await User.create(info);

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
    throwError.userNotFound();
  }

  if (user && user.username !== username) {
    throwError.doNotHavePermission();
  }
};

exports.correctPassword = async function (candidatePassword, userPassword) {
  return await User.prototype.correctPassword(candidatePassword, userPassword);
};
