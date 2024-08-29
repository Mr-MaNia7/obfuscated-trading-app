const mongoose = require('mongoose');
const validator = require ('validator');

const verifyLogSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  verifyCode: {
    type: Number,
    required: [true, 'Verify code is required.'],
  },
  expiredAt: Date,
  createdAt: Date
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});


const VerifyLog = mongoose.model('VerifyLog', verifyLogSchema);

module.exports = VerifyLog;