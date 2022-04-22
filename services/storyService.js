const Story = require('../models/storyModel');

exports.findAllStories = async (req, res, next) =>
  await Story.findAll({ raw: true });

exports.findStory = async (req, res, next) => {
  const id = Number(req.params.id);
  return await Story.findOne({ where: { id: id }, raw: true });
};
