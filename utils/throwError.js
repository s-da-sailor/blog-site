const AppError = require('./AppError');

exports.storyNotFound = () => {
  throw new AppError('No story found with that ID', 404);
};

exports.userNotFound = () => {
  throw new AppError('No user found with that username', 404);
};

exports.doNotHavePermission = () => {
  throw new AppError('You do not have permission!', 403);
};
