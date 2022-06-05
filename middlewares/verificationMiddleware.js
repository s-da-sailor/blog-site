const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

// Verify token
exports.verify = catchAsync(async (req, res, next) => {
  // 1. If token exists
  const token = req.cookies.jabcookie;

  if (!token) {
    res.clearCookie('jabcookie');
    return next();
  }

  // 2. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const freshUser = await User.findOne({
    where: { username: decoded.username },
  });

  if (!freshUser) {
    res.clearCookie('jabcookie');
    return next();
  }

  // 4. If user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    res.clearCookie('jabcookie');
    return next();
  }

  // 5. Grant acess to protected route
  req.user = freshUser.dataValues;

  next();
});
