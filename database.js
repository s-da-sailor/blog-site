// DEPENDENCIES
const Sequelize = require('sequelize');

// DATABASE
const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

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
