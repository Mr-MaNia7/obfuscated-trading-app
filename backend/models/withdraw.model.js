const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const withdrawSchema = new mongoose.Schema({
  asset: {
    type: String,
    required: [true, 'Asset is required.']
  },
  address: {
    type: String,
    required: [true, 'Address is required.']
  },
  network: {
    type: String,
    required: [true, 'Network is required.']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required.']
  },
  fee: {
    type: Number,
    required: [true, 'Fee is required.']
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
    required: [true, 'Withdraw must belong to a user.']
  },
  createdAt: Date
});

const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = Withdraw;