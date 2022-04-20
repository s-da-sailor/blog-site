/*
 * Title: blog-site application (to be changed later)
 * Description: A javascript application for a simple blog site
 */

// DEPENDENCIES
const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/database');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const storyRouter = require('./routes/storyRoutes');

// CONFIGURATION FILE
dotenv.config({ path: './config.env' });

// DATABASE TEST AND RUN
(async () => {
  try {
    await db.sync();

    console.log('Database Connected');
  } catch (err) {
    console.log(`Error: ${err}`);
  }
})();

// APPLICATION
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use('/api/v1/stories', storyRouter);

// for unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

// global error handling middleware
app.use(globalErrorHandler);

// EXPORT
module.exports = app;
