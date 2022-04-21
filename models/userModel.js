// DEPENDENCIES
const { DataTypes } = require('sequelize');
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
      unique: true,
      validate: {
        notNull: {
          msg: 'Email cannot be null',
        },
        notEmpty: {
          args: true,
          msg: 'Email cannot be empty',
        },
        isEmail: {
          msg: 'Must be a valid email address',
        },
      },
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password cannot be null',
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
    passwordChanged: {
      type: DataTypes.TIME,
    },
  },
  {
    tableName: 'Users',
  }
);

// EXPORT
module.exports = User;
