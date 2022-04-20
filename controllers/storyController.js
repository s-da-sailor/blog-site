/*
 * Title: Story Controller
 * Description: This application contains controllers for handling requests on story routes
 * Author: Akash Lanard
 * Date: 7 April 2022
 */

// DEPENDENCIES
const Story = require('../models/storyModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Upto this point we assume that request validation has been done
// So in case of any error in the try catch blocks it has to be on the server side

// controller for getting all the stories
exports.getAllStories = catchAsync(async (req, res, next) => {
  const stories = await Story.findAll({ raw: true });
  res.status(200).json({
    // Send all stories as response (or empty array if not found)
    status: 'success',
    results: stories.length,
    data: {
      stories,
    },
  });
});

// controller for getting a specific story
exports.getStory = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id); // convert string to number
  const story = await Story.findOne({ where: { id: id }, raw: true }); // find story having the specified ID

  if (!story) {
    // if the story is not found return 404
    return next(new AppError('No story found with that ID', 404));
  }

  res.status(200).json({
    // return the story as JSON
    status: 'success',
    data: {
      story,
    },
  });
});

// controller for creating a story
exports.createStory = catchAsync(async (req, res, next) => {
  const info = {
    // get info from request body
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
  };

  const newStory = await Story.create(info); // create new story in DB

  res.status(201).json({
    status: 'success',
    data: {
      story: newStory.dataValues, // return newly created story
    },
  });
});

// controller for updating a story (partial payload)
exports.updateStoryPatch = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id); // convert string to number

  const info = {};
  if (req.body.title) {
    // construct object from partial payload
    info.title = req.body.title;
  }
  if (req.body.description) {
    info.description = req.body.description;
  }

  console.log(info);
  // first returned array element is the number of rows affected in the update
  const [updatedStoriesCount] = await Story.update(info, {
    where: { id: id },
  }); // find story having the specified ID

  if (!updatedStoriesCount) {
    return next(new AppError('No story found with that ID', 404));
  }

  const updatedStory = await Story.findOne({
    where: { id: id },
    raw: true,
  });

  // get the updated story
  res.status(200).json({
    status: 'success',
    data: {
      // return the updated story
      story: updatedStory,
    },
  });
});

// controller for updating a story (full payload)
exports.updateStoryPut = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id); // convert string to number

  const info = {};
  info.title = req.body.title; // construct object from full payload
  info.description = req.body.description;

  console.log(info);
  // first returned array element is the number of rows affected in the update
  const [updatedStoriesCount] = await Story.update(info, {
    where: { id: id },
  }); // find story having the specified ID

  if (!updatedStoriesCount) {
    return next(new AppError('No story found with that ID', 404));
  }

  const updatedStory = await Story.findOne({
    where: { id: id },
    raw: true,
  });

  // get the updated story
  res.status(200).json({
    status: 'success',
    data: {
      // return the updated story
      story: updatedStory,
    },
  });
});

// controller for deleting a story
exports.deleteStory = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id); // convert string to number
  // it returns number of deleted rows
  const deletedRowsCount = await Story.destroy({ where: { id: id } }); // delete the entry from DB

  if (!deletedRowsCount) {
    return next(new AppError('No story found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
