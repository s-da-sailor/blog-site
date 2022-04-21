// DEPENDENCIES
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// USER ROUTER
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// ROUTES
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUserPatch)
  .put(userController.updateUserPut)
  .delete(userController.deleteUser);

// EXPORT
module.exports = router;
