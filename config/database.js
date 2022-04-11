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