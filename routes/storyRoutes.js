// DEPENDENCIES
const express = require('express');
const storyController = require('../controllers/storyController');
const routeProtectionMiddleware = require('../middlewares/routeProtectionMiddleware');

// STORY ROUTER
const router = express.Router();

// ROUTES
router
  .route('/')
  .get(storyController.getAllStories)
  .post(routeProtectionMiddleware.protect, storyController.createStory);

router
  .route('/:id')
  .get(storyController.getStory)
  .patch(routeProtectionMiddleware.protect, storyController.updateStoryPatch)
  .put(routeProtectionMiddleware.protect, storyController.updateStoryPut)
  .delete(routeProtectionMiddleware.protect, storyController.deleteStory);

// EXPORT
module.exports = router;
