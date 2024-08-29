const mongoose = require('mongoose');

const LoginLogSchema = new mongoose.Schema({
    accountName: {
    type: String,
    required: [true, 'Friend account name is required.']
  },
  email: {
    type: String,
    required: [true, 'Asset is required.']
  },
  userAgent: {
    type: String,
    required: [true, 'userAgent is required.']
  },
  ip: {
    type: String,
    required: [true, 'Ip is required.']
  },
  location: {
    type: String,
    required: [true, 'Location is required.']
  },
  createdAt: Date
});

const LoginLog = mongoose.model('LoginLog', LoginLogSchema);

module.exports = LoginLog;