// DEPENDENCIES
const express = require('express');
const userController = require('../controllers/userController');

// USER ROUTER
const router = express.Router();

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
