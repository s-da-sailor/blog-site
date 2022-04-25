// DEPENDENCIES
const Story = require('../models/storyModel');
const AppError = require('../utils/AppError');

// STORY SERVICES
exports.findAllStories = async () => await Story.findAll({ raw: true });

exports.findStoryById = async (id) => {
  const story = await Story.findOne({ where: { id }, raw: true });

  if (!story) {
    throw new AppError('No story found with that ID', 404);
  }

  return story;
};

exports.createStory = async (info) => await Story.create(info);

exports.updateStoryById = async (info, id) => {
  await Story.update(info, {
    where: { id },
  });
};

exports.deleteStoryById = async (id) => {
  await Story.destroy({ where: { id } });
};

exports.isSameAuthor = async (id, username) => {
  const story = await Story.findOne({ where: { id }, raw: true });

  if (!story) {
    throw new AppError('No story found with that ID', 404);
  }

  if (story.author !== username) {
    throw new AppError('You do not have permission!', 403);
  }
};