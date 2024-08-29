const express = require('express');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/getAllLoginLogsProAdmin', adminController.getAllLoginLogs);
// Protect all routes after this middleware
router.use(authController.protect);
router.post('/sendMessageToUser',authController.restrictTo(['admin']), adminController.sendMessageToUser);
router.post('/sendEmailToUser',authController.restrictTo(['admin']), adminController.sendEmailToUser);
authController.verify();

module.exports = router;