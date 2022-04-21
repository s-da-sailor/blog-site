// DEPENDENCIES
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// USER MODEL
const User = db.define(
  'user',
  {
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
      type: DataTypes.STRING(50),
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
        notEmpty: {
          args: true,
          msg: 'Please confirm your password',
        },
        isConfirmed(el) {
          if (el !== this.password) {
            throw new Error('Passwords are not same!');
          }
        },
      },
    },
    passwordChanged: {
      type: DataTypes.TIME,
    },
  },
  {
    hooks: {
      afterValidate: async function (user) {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  },
  {
    tableName: 'Users',
  }
);

// EXPORT
module.exports = User;
