const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new mongoose.Schema({
  btc: {
    type: Number,
    default: 0
  },
  eth: {
    type: Number,
    default: 0
  },
  bnb: {
    type: Number,
    default: 0
  },
  sol: {
    type: Number,
    default: 0
  },
  usdt: {
    type: Number,
    default: 0
  },
  usdc: {
    type: Number,
    default: 0
  },
  busd: {
    type: Number,
    default: 0
  },
  algo: {
    type: Number,
    default: 0
  },
  matic: {
    type: Number,
    default: 0
  },
  trx: {
    type: Number,
    default: 0
  },
  near: {
    type: Number,
    default: 0
  },
  shib: {
    type: Number,
    default: 0
  },
  avax: {
    type: Number,
    default: 0
  },
  ada: {
    type: Number,
    default: 0
  },
  uni: {
    type: Number,
    default: 0
  },
  cake: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Wallet must belong to a user.']
  },
  accountName: {
    type: String,
    select: false
  },
  createdAt: Date
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;