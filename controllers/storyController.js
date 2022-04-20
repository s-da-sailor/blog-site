// DEPENDENCIES
const Story = require('../models/storyModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// CONTROLLERS
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

exports.getStory = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);
  const story = await Story.findOne({ where: { id: id }, raw: true });

  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      story,
    },
  });
});

exports.createStory = catchAsync(async (req, res, next) => {
  const info = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
  };

  const newStory = await Story.create(info);

  res.status(201).json({
    status: 'success',
    data: {
      story: newStory.dataValues,
    },
  });
});

exports.updateStoryPatch = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);

  const info = {};
  if (req.body.title) {
    info.title = req.body.title;
  }
  if (req.body.description) {
    info.description = req.body.description;
  }

  console.log(info);
  // first returned array element is the number of rows affected in the update
  const [updatedStoriesCount] = await Story.update(info, {
    where: { id: id },
  });

  if (!updatedStoriesCount) {
    return next(new AppError('No story found with that ID', 404));
  }

  const updatedStory = await Story.findOne({
    where: { id: id },
    raw: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      story: updatedStory,
    },
  });
});

exports.updateStoryPut = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);

  const info = {};
  info.title = req.body.title;
  info.description = req.body.description;

  console.log(info);

  const [updatedStoriesCount] = await Story.update(info, {
    where: { id: id },
  });

  if (!updatedStoriesCount) {
    return next(new AppError('No story found with that ID', 404));
  }

  const updatedStory = await Story.findOne({
    where: { id: id },
    raw: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      story: updatedStory,
    },
  });
});

exports.deleteStory = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);
  const deletedRowsCount = await Story.destroy({ where: { id: id } }); // returns number of deleted rows

  if (!deletedRowsCount) {
    return next(new AppError('No story found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
