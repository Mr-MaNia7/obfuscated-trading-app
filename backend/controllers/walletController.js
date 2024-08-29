const sendError = require('./assets/errorController');
const Wallet = require('../models/wallet.model');

exports.getBalance = async (req, res) => {
  try {
    const balance = await Wallet.findOne({ user: req.user.id }).select('-user');
    res.status(200).json({
      status: 'success',
      data: {
        balance
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};