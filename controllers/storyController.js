// DEPENDENCIES
const Story = require('../models/storyModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// CONTROLLERS
exports.getAllStories = catchAsync(async (req, res, next) => {
  const stories = await Story.findAll({ raw: true });
  res.status(200).json({
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
    author: req.user.username,
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

  const previousStory = await Story.findOne({ where: { id: id }, raw: true });

  if (!previousStory) {
    return next(new AppError('No story found with this ID', 404));
  }
  if (previousStory.author !== req.user.username) {
    return next(
      new AppError('You do not have permission to update this story', 403)
    );
  }

  const info = {};
  if (req.body.title) {
    info.title = req.body.title;
  }
  if (req.body.description) {
    info.description = req.body.description;
  }

  await Story.update(info, {
    where: { id: id },
  });

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

  const previousStory = await Story.findOne({ where: { id: id }, raw: true });

  if (!previousStory) {
    return next(new AppError('No story found with this ID', 404));
  }
  if (previousStory.author !== req.user.username) {
    return next(
      new AppError('You do not have permission to update this story', 403)
    );
  }

  const info = {};
  info.title = req.body.title;
  info.description = req.body.description;

  await Story.update(info, {
    where: { id: id },
  });

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

  const previousStory = await Story.findOne({ where: { id: id }, raw: true });

  if (!previousStory) {
    return next(new AppError('No story found with this ID', 404));
  }
  if (!previousStory || previousStory.author !== req.user.username) {
    return next(
      new AppError('You do not have permission to delete this story', 403)
    );
  }

  await Story.destroy({ where: { id: id } });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
