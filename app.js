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
*             by him/her. 
* Author: Akash Lanard
* Date: 5 April 2022
*/

// dependencies
const express = require('express');

// express application
const app = express();

// middlewares
app.use(express.json());

// CRUD Endpoints for Story (@TODO handle this using a separate Router later)

//dummy data for stories
const stories  = [
  {
    id: 0,
    title: "Dummy Title 1",
    description: "Dummy Description 1",
    author: "Dummy author 1",
    createdAt: Date.now()
  },
  {
    id: 1,
    title: "Dummy Title 2",
    description: "Dummy Description 2",
    author: "Dummy author 2",
    createdAt: Date.now()
  },
  {
    id: 2,
    title: "Dummy Title 3",
    description: "Dummy Description 3",
    author: "Dummy author 3",
    createdAt: Date.now()
  }
];

// Story controllers (@TODO shift them in controller directory later)

// controller for getting all the stories
const getAllStories = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: stories.length,
    data: {                                     // serve dummy stories array
      stories
    }
  });
};

// controller for getting a specific story
const getStory = (req, res) => {
  const id = Number(req.params.id);             // convert string to number
  const story = stories.find(s => s.id === id); // find story having the specified ID

  if(!story) {                                  // if the story is not found return 404
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({                        // return the story as JSON 
    status: 'success',
    data: {                                     // serve from dummy data
      story
    }
  });
};

// controller for creating a story
const createStory = (req, res) => {
  const newId = stories[stories.length - 1].id + 1;         // get newID 
  const newStory = Object.assign({ id: newId }, req.body);  // dummy story object
  stories.push(newStory);                                   // pushed in the dummy array
  res.status(201).json({
    status: 'success',
    data: {                                     // create in db and return (to be done later)
      story: newStory
    }
  });
};

// controller for updating a story (partial payload)
const updateStoryPatch = (req, res) => {
  const id = Number(req.params.id);             // convert string to number
  const story = stories.find(s => s.id === id); // find story having the specified ID

  if(!story) {                                  // if the story is not found return 404
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({                        // return the story as JSON 
    status: 'success',                          
    data: {                                     // update in db and return (to be done later)
      story: '<Updated story here..>'
    }
  });
};

// controller for updating a story (full payload)
const updateStoryPut = (req, res) => {
  const id = Number(req.params.id);             // convert string to number
  const story = stories.find(s => s.id === id); // find story having the specified ID

  if(!story) {                                  // if the story is not found return 404
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({                        // return the story as JSON 
    status: 'success',                          
    data: {                                     // update in db and return (to be done later)
      story: '<Updated story here..>'
    }
  });
};

// controller for deleting a story
const deleteStory = (req, res) => {
  const id = Number(req.params.id);             // convert string to number
  const story = stories.find(s => s.id === id); // find story having the specified ID

  if(!story) {                                  // if the story is not found return 404
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({                        // body is empty (no content)
    status: 'success',                          
    data: null                                  // delete from db (to be done later)
  });
};

// Story Router (@TODO transfer it in a different directory)
const storyRouter = express.Router();

// routes (@TODO transfer it in a different directory)
storyRouter
  .route('/')
  .get(getAllStories)
  .post(createStory);

storyRouter
  .route('/:id')
  .get(getStory)
  .patch(updateStoryPatch)
  .put(updateStoryPut)
  .delete(deleteStory);

app.use('/api/v1/stories', storyRouter);        // using story Router as a middleware

// export the application
module.exports = app;