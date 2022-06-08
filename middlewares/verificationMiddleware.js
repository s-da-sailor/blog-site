const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Verify token
exports.verify = async (req, res, next) => {
  // 1. If token exists
  const token = req.cookies.jabcookie || null;

  if (!token) {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.clearCookie('jabcookie');
    res.cookie('jabcookie', '', cookieOptions);
    return next();
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.clearCookie('jabcookie');
    res.cookie('jabcookie', '', cookieOptions);
    return next();
  }

  // 3. Check if user still exists
  let freshUser;
  try {
    freshUser = await User.findOne({
      where: { username: decoded.username },
    });
  } catch (err) {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.clearCookie('jabcookie');
    res.cookie('jabcookie', '', cookieOptions);
    return next();
  }

  if (!freshUser) {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.clearCookie('jabcookie');
    res.cookie('jabcookie', '', cookieOptions);
    return next();
  }

  // 4. If user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.clearCookie('jabcookie');
    res.cookie('jabcookie', '', cookieOptions);
    return next();
  }

  // 5. Grant acess to protected route
  req.user = freshUser.dataValues;

  next();
};
