// DEPENDENCIES
const Sequelize = require('sequelize');

// DATABASE

const dbName = process.env.DB_NAME || 'blog_site';
const dbUser = process.env.DB_USERNAME || 'root';
const password = process.env.DB_PASSWORD || '';
const host = process.env.DB_HOST || 'localhost';

const database = new Sequelize(dbName, dbUser, password, {
  host: host,
  port: 3306,
  dialect: 'mysql',
  logging: false,
});

// DB CONNECT
database.connect = async () => {
  try {
    await database.sync({ force: true });

    console.log('Database Connected');
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

// EXPORT
module.exports = database;
