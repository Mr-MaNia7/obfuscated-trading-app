const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepositSchema = new mongoose.Schema({
  referenceCode: {
    type: String,
    required: [true, 'Reference code is required.']
  },
  asset: {
    type: String,
    required: [true, 'Asset is required.']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required.']
  },
  status: {
    type: Number,
    enum: {
      values: [0, 1, 2],
    },
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Deposit must belong to a user.']
  },
  accountName: {
    type: String,
    required: [true, 'Account name is required.']
  },
  createdAt: Date
});

const Deposit = mongoose.model('Deposit', DepositSchema);

module.exports = Deposit;