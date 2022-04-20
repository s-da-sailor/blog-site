// DEPENDENCIES
const { DataTypes } = require('sequelize');
const db = require('../config/database');

// USER MODEL
const User = db.define(
  'user',
  {
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(30),
      allowNull: false,
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
