/*
 * Title: blog-site application (to be changed later)
 * Description: A javascript application for a simple blog site having following functionalities:
 *             1. In the home page there will be a list of stories posted by different authors
 *             containing title, description, author name, created at etc.
 *             2. When clicked at any of the stories we will be redirected to a seperate page
 *             where we will be able to read the full story.
 *             3. Users can register to this web site. Registered users will be able to log in
 *             using their username and password. Registered users will be able to post, update and delete stories.
 *             4. Everyone (logged in or anonymous) will be able to read the stories. Anonymous users will be able to only read
 *             the stories. Registered users will be able to post stories and update/delete stories which are posted
 *             by the same user
 * Author: Akash Lanard
 * Date: 5 April 2022
 */

// DEPENDENCIES
const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/database');
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
app.use(express.json()); // for getting JSON request body
app.use('/api/v1/stories', storyRouter); // using story Router

// EXPORT
module.exports = app;
