/*
* Title: Database Configuration
* Description: This application returns a sequelize instance using database configuration
* Author: Akash Lanard
* Date: 11 April 2022
*/

const Sequelize = require('sequelize');

module.exports = new Sequelize(
  'blog_site',                    // Database name
  'root',                         // Username
  '',                             // Password
  {
    host: 'localhost',            // Host
    dialect: 'mysql',             // Dialect
    //logging: false                // logging
  }
); 