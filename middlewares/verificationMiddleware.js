const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Verify token
exports.verify = async (req, res, next) => {
  // 1. If token exists
  const token = req.cookies.jabcookie || null;

  if (!token) {
    res.clearCookie('jabcookie');
    return next();
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    res.clearCookie('jabcookie');
    return next();
  }

  // 3. Check if user still exists
  let freshUser;
  try {
    freshUser = await User.findOne({
      where: { username: decoded.username },
    });
  } catch (err) {
    res.clearCookie('jabcookie');
    return next();
  }

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
};
