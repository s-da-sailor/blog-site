// DEPENDENCIES
const express = require('express');
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

// STORY ROUTER
const router = express.Router();

// ROUTES
router
  .route('/')
  .get(authController.protect, storyController.getAllStories)
  .post(storyController.createStory);

router
  .route('/:id')
  .get(storyController.getStory)
  .patch(storyController.updateStoryPatch)
  .put(storyController.updateStoryPut)
  .delete(storyController.deleteStory);

// EXPORT
module.exports = router;
