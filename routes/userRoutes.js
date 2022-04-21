// DEPENDENCIES
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// USER ROUTER
const router = express.Router();

// ROUTES
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/').get(userController.getAllUsers);

router
  .route('/:username')
  .get(userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .put(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

// EXPORT
module.exports = router;
