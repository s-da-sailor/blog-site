// DEPENDENCIES
const express = require('express');
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

// STORY ROUTER
const router = express.Router();

// ROUTES
router
  .route('/')
  .get(storyController.getAllStories)
  .post(authController.protect, storyController.createStory);

router
  .route('/:id')
  .get(storyController.getStory)
  .patch(authController.protect, storyController.updateStoryPatch)
  .put(authController.protect, storyController.updateStoryPut)
  .delete(authController.protect, storyController.deleteStory);

// EXPORT
module.exports = router;
