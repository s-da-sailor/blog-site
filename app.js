/*
 * Title: blog-site application (to be changed later)
 * Description: A javascript application for a simple blog site
 */

// DEPENDENCIES
const express = require('express');
require('./utils/setConfig');
const cors = require('cors');
const db = require('./database');
const globalErrorHandlingMiddleware = require('./middlewares/globalErrorHandlingMiddleware');
const unhandledRouteHandler = require('./utils/unhandledRouteHandler');
const storyRouter = require('./routes/storyRoutes');
const userRouter = require('./routes/userRoutes');

// DATABASE TEST AND RUN
db.connect();

// APPLICATION
const app = express();

// CORS OPTIONS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  optionsOnSuccess: 200,
};

// MIDDLEWARES
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/v1/stories', storyRouter);
app.use('/api/v1/users', userRouter);

// for unhandled routes
app.all('*', unhandledRouteHandler);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandlingMiddleware);

// EXPORT
module.exports = app;
