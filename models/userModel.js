// DEPENDENCIES
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const db = require('../database');

// USER MODEL
const User = db.define(
  'user',
  {
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
      unique: {
        args: true,
        msg: 'This username is already in use',
      },
      validate: {
        notNull: {
          msg: 'Username cannot be null',
        },
        notEmpty: {
          args: true,
          msg: 'Username cannot be empty',
        },
        len: {
          args: [1, 30],
          msg: 'Username must be between 1 and 30 characters',
        },
        is: {
          args: [/([A-Za-z.0-9\-_]+)/],
          msg: 'Only letters, numbers, underscores, periods and dashes are allowed in username',
        },
      },
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name cannot be null',
        },
        notEmpty: {
          args: true,
          msg: 'Name cannot be empty',
        },
        len: {
          args: [1, 50],
          msg: 'Name must be between 1 and 50 characters',
        },
        is: {
          args: [/^([a-zA-Z]+\s)*[a-zA-Z]+$/],
          msg: 'Only letters and spaces allowed in name',
        },
      },
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: {
        args: true,
        msg: 'This email is already in use',
      },
      validate: {
        notNull: {
          msg: 'Please provide a email',
        },
        notEmpty: {
          args: true,
          msg: 'Email cannot be empty',
        },
        isEmail: {
          msg: 'Please provide a valid email address',
        },
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a password',
        },
        notEmpty: {
          args: true,
          msg: 'Password cannot be empty',
        },
        len: {
          args: [8, 50],
          msg: 'Password must be between 8 and 50 characters',
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please confirm your password',
        },
        isConfirmed(el) {
          if (el !== this.password) {
            throw new Error('Passwords are not same!');
          }
        },
      },
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'Users',
    hooks: {
      afterValidate: async function (user) {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  }
);

User.prototype.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

// EXPORT
module.exports = User;
