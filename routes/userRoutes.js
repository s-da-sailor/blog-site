// DEPENDENCIES
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const storyController = require('../controllers/storyController');
const routeProtectionMiddleware = require('../middlewares/routeProtectionMiddleware');
const verificationMiddleware = require('../middlewares/verificationMiddleware');

// USER ROUTER
const router = express.Router();

// ROUTES
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify', verificationMiddleware.verify, authController.verify);

router.route('/').get(userController.getAllUsers);

router
  .route('/:username')
  .get(userController.getUser)
  .patch(routeProtectionMiddleware.protect, userController.updateUserPatch)
  .put(routeProtectionMiddleware.protect, userController.updateUserPut)
  .delete(routeProtectionMiddleware.protect, userController.deleteUser);

router.route('/:username/stories').get(storyController.getUserSpecificStories);

// EXPORT
module.exports = router;
