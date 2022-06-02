// DEPENDENCIES
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const storyService = require('../services/storyService');
const contentNegotiation = require('../utils/contentNegotiation');

// CONTROLLERS
exports.getAllStories = catchAsync(async (req, res, next) => {
  const stories = await storyService.findAllStories();

  contentNegotiation.serveData(stories, 200, req, res, next);
});

exports.getStory = catchAsync(async (req, res, next) => {
  const story = await storyService.findStoryById(req.params.id);

  contentNegotiation.serveData(story, 200, req, res, next);
});

exports.createStory = catchAsync(async (req, res, next) => {
  const info = {
    title: req.body.title,
    description: req.body.description,
    author: req.user.username,
  };

  const newStory = await storyService.createStory(info);

  contentNegotiation.serveData(newStory.dataValues, 201, req, res, next);
});

exports.updateStoryPatch = catchAsync(async (req, res, next) => {
  await storyService.isSameAuthor(req.params.id, req.user.username);

  const info = {};
  if (req.body.title) {
    info.title = req.body.title;
  }
  if (req.body.description) {
    info.description = req.body.description;
  }

  await storyService.updateStoryById(info, req.params.id);

  const updatedStory = await storyService.findStoryById(req.params.id);

  contentNegotiation.serveData(updatedStory, 200, req, res, next);
});

exports.updateStoryPut = catchAsync(async (req, res, next) => {
  await storyService.isSameAuthor(req.params.id, req.user.username);

  const info = {};
  info.title = req.body.title || '';
  info.description = req.body.description || '';

  if (!info.title || !info.description) {
    return next(
      new AppError('Please provide a new title and description', 400)
    );
  }

  await storyService.updateStoryById(info, req.params.id);

  const updatedStory = await storyService.findStoryById(req.params.id);

  contentNegotiation.serveData(updatedStory, 200, req, res, next);
});

exports.deleteStory = catchAsync(async (req, res, next) => {
  await storyService.isSameAuthor(req.params.id, req.user.username);

  await storyService.deleteStoryById(req.params.id);

  contentNegotiation.serveData(null, 204, req, res, next);
});

exports.getUserSpecificStories = catchAsync(async (req, res, next) => {
  const stories = await storyService.findUserSpecificStories(
    req.params.username
  );

  contentNegotiation.serveData(stories, 200, req, res, next);
});
