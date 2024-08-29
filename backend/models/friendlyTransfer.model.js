const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendlyTransferSchema = new mongoose.Schema({
  friendAccountName: {
    type: String,
    required: [true, 'Friend account name is required.']
  },
  asset: {
    type: String,
    required: [true, 'Asset is required.']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required.']
  },
  usdAmount: {
    type: Number,
    required: [true, 'USD Amount is required.']
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
    required: [true, 'FriendlyTransfer must belong to a user.']
  },
  createdAt: Date
});

const FriendlyTransfer = mongoose.model('FriendlyTransfer', FriendlyTransferSchema);

module.exports = FriendlyTransfer;