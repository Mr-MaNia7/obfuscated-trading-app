const express = require('express');
const authController = require('./../controllers/authController');
const sessionController = require('./../controllers/sessionController');

const router = express.Router();

router.use(authController.protect);
router.route('/')
  .get(sessionController.getAllSessions)
  .post(
    sessionController.uploadSessionImage,
    sessionController.createSession
  );

router.route('/:id')
  .get(sessionController.getSession)
  .delete(
    authController.restrictTo('admin'),
    sessionController.deleteSession
  );

module.exports = router;