const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');

// For getting access to the protected routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1. If token exists
  const token = req.cookies.jabcookie || null;

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
