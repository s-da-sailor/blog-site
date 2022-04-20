// DEPENDENCIES
const { DataTypes } = require('sequelize');
const db = require('../config/database');

// STORY MODEL
const Story = db.define(
  'story',
  {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(10000),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    tableName: 'Stories',
  }
);

// EXPORT
module.exports = Story;
