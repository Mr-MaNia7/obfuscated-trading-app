const express = require('express');
const authController = require("../controllers/authController");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
router.post('/confirmWithdraw', transactionController.checkTransactionKey, transactionController.createWithdrawTrx);
router.post('/confirmFriendlyTransfer', transactionController.confirmFriendlyTransfer);
router.get('/getLatestWithdrawTrx', transactionController.getLatestWithdrawTrx);
router.post('/getDepositAddress', transactionController.getDepositAddress);
router.post('/confirmDeposit', transactionController.checkTransactionKey, transactionController.createDepositTrx);
router.get('/getLatestDepositTrx', transactionController.getLatestDepositTrx);
router.get('/getLastestFriendlyTrx', transactionController.getLastestFriendlyTrx);

module.exports = router;