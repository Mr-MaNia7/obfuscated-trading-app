const express = require('express');
const authController = require("../controllers/authController");
const walletController = require("../controllers/walletController");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
router.get('/getBalance', walletController.getBalance);

// router.patch('/updateMe',
//   // userController.uploadUserPhoto,
//   // userController.resizeUserPhoto,
//   userController.updateMe
// );

// router.delete('/deleteMe', userController.deleteMe);

module.exports = router;