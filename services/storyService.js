// DEPENDENCIES
const Story = require('../models/storyModel');
const throwError = require('../utils/throwError');

// STORY SERVICES
exports.findAllStories = async () =>
  await Story.findAll({ order: [['id', 'DESC']], raw: true });

exports.findStoryById = async (id) => {
  const story = await Story.findOne({ where: { id }, raw: true });

  if (!story) {
    throwError.storyNotFound();
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
    throwError.storyNotFound();
  }

  if (story && story.author !== username) {
    throwError.doNotHavePermission();
  }
};

exports.findUserSpecificStories = async (username) =>
  await Story.findAll({
    where: { author: username },
    order: [['id', 'DESC']],
    raw: true,
  });
