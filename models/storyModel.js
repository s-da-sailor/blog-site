/*
* Title: Story Model
* Description: Story Model for the Blog Site
* Author: Akash Lanard
* Date: 11/04/2022
*/

const {Sequelize, DataTypes} = require('sequelize');
const db = require('./../config/database');

const Story = db.define('story', {
  title: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(10000),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
}, {
  tableName: 'Stories'
});

module.exports = Story;