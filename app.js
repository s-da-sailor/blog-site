/*
 * Title: blog-site application (to be changed later)
 * Description: A javascript application for a simple blog site
 */

// DEPENDENCIES
const express = require('express');
require('./utils/setConfig');
const db = require('./database');
const globalErrorHandler = require('./controllers/errorController');
const unhandledRouteHandler = require('./utils/unhandledRouteHandler');
const storyRouter = require('./routes/storyRoutes');
const userRouter = require('./routes/userRoutes');

// DATABASE TEST AND RUN
db.connect();

// APPLICATION
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use('/api/v1/stories', storyRouter);
app.use('/api/v1/users', userRouter);

// for unhandled routes
app.all('*', unhandledRouteHandler);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// EXPORT
module.exports = app;
