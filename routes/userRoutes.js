// DEPENDENCIES
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const routeProtectionMiddleware = require('../middlewares/routeProtectionMiddleware');

// USER ROUTER
const router = express.Router();

// ROUTES
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post(
  '/verify',
  routeProtectionMiddleware.protect,
  authController.verify
);

router.route('/').get(userController.getAllUsers);

router
  .route('/:username')
  .get(userController.getUser)
  .patch(routeProtectionMiddleware.protect, userController.updateUserPatch)
  .put(routeProtectionMiddleware.protect, userController.updateUserPut)
  .delete(routeProtectionMiddleware.protect, userController.deleteUser);

// EXPORT
module.exports = router;
