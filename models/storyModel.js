// DEPENDENCIES
const { DataTypes } = require('sequelize');
const db = require('../config/database');

// STORY MODEL
const Story = db.define(
  'story',
  {
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title cannot be null',
        },
        notEmpty: {
          args: true,
          msg: 'Title cannot be empty',
        },
        len: {
          args: [1, 100],
          msg: 'Title must be between 1 and 100 characters',
        },
      },
    },
    description: {
      type: DataTypes.STRING(10000),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Story description cannot be null',
        },
        notEmpty: {
          args: true,
          msg: 'Story description cannot be empty',
        },
        len: {
          args: [1, 10000],
          msg: 'Story description must be between 1 and 10000 characters',
        },
      },
    },
    author: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Author name cannot be null',
        },
        notEmpty: {
          args: true,
          msg: 'Author name cannot be empty',
        },
        len: {
          args: [1, 50],
          msg: 'Author name be between 1 and 50 characters',
        },
        is: {
          args: [/^([a-zA-Z]+\s)*[a-zA-Z]+$/],
          msg: 'Only letters and spaces allowed in author name',
        },
      },
    },
  },
  {
    tableName: 'Stories',
  }
);

// EXPORT
module.exports = Story;
