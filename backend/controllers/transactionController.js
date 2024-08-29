const _ = require('lodash');
const axios = require('axios');
const sendError = require('./assets/errorController');
const User = require('../models/user.model');
const Withdraw = require('../models/withdraw.model');
const Wallet = require('../models/wallet.model');
const FriendlyTransfer = require('../models/friendlyTransfer.model');
const Deposit = require('../models/deposit.model');
const ReferenceCode = require('../models/referenceCode.model');
const { generateVerifyCode } = require('../utils/number');
const APIFeatures = require('../utils/apiFeatures');
const { censorWalletAddress } = require('../utils/string');
const { DEPOSIT_ADDRESSES, userTiers } = require('../utils/staticData');
// const { getCoinPrice } = require('../services/interval');

const LIMIT = '5';

exports.checkTransactionKey = async (req, res, next) => {
  try {
    const data = req.body;
    const { transactionKey } = data;
    // ------- Check transaction key -------------
    if(!transactionKey) {
      return sendError({message: {transactionKey: 'Transaction key is required'}}, 400, req, res);
    }
    if(transactionKey !== req.user.transactionKey) {
      return sendError({message: {transactionKey: 'Incorrect transaction key'}}, 400, req, res);
    }
    
    // if success
    next();
  } catch(err) {
    sendError(err, 400, req, res);
  }
};

exports.createWithdrawTrx = async (req, res) => {
  try {
    req.body.user = req.user.id;
    req.body.createdAt = new Date().toISOString();
    req.body.address = censorWalletAddress(req.body.address);
    const newDoc = await Withdraw.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};

// exports.checkIfAccountName = async (req, res, next) => {
//   try {
//     const { friendAccountName } = req.body;
//     const user = await User.findOne({ accountName: friendAccountName });

//     if(!user) {
//       return sendError({message: {accountName: `No user with this account name "${friendAccountName}"`}}, 400, req, res);
//     }

//     if(user.tier < 1) {
//       return sendError({message: {tier: 'Transaction failed. Recipient user must be of Bronze tier or higher.'}}, 400, req, res);
//     }

//     next();
//   } catch(err) {
//     sendError(err, 400, req, res);
//   }
// };

const BINANCE_BASE_API = 'https://api.binance.com/api';
const QUOTE = 'USDT';

exports.confirmFriendlyTransfer = async (req, res) => {
  try {
    const { friendAccountName, amount, asset, price, fee } = req.body;
    const friend = await User.findOne({ accountName: friendAccountName });
    const symbol = String(asset).toLowerCase();

    const coinPrice = Number(price);

    if(req.user.accountName === friendAccountName) {
      return sendError({message: {accountName: `You can't transfer assets to you`}}, 400, req, res);
    }

    if(!friend) {
      return sendError({message: {accountName: `No user with this account name "${friendAccountName}"`}}, 400, req, res);
    }

    if(friend.tier < 1) {
      return sendError({message: {tier: 'Transaction failed. Recipient user must be of Bronze tier or higher.'}}, 400, req, res);
    }

    const usdAmount = Math.round(coinPrice * amount * 10**2) / 10**2;

    // check if total transfer amount exceeds the limit of 24hrs transfer amount.
    const totalTransfer = await FriendlyTransfer.find({ user: req.user.id, friendAccountName, createdAt: {$gte: Date.now() - 24 * 3600 * 1000} });
    const totoalTransferUSD = _.sumBy(totalTransfer, 'usdAmount');
    if(usdAmount + totoalTransferUSD > userTiers[friend.tier]?.transferLimit) {
      return sendError({message: {accountName: `Transaction failed. Recipient user has exceeded the daily limit of transfer.`}}, 400, req, res);
    }

    // if success
    const balanceOfUser = await Wallet.findOne({ user: req.user.id });
    const balanceOfFriend = await Wallet.findOne({ user: friend._id });
    await Wallet.findByIdAndUpdate(balanceOfUser?._id, { [symbol]: (Number(balanceOfUser[symbol]) - Number(amount) - Number(fee)) });
    await Wallet.findByIdAndUpdate(balanceOfFriend?._id, { [symbol]: (Number(balanceOfFriend[symbol]) + Number(amount)) });

    req.body.usdAmount = usdAmount;
    req.body.user = req.user.id;
    req.body.status = 2;
    req.body.createdAt = new Date().toISOString();
    const newDoc = await FriendlyTransfer.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};

exports.getLatestWithdrawTrx = async (req, res) => {
  try {
    req.query = {
      user: req.user.id,
      limit: LIMIT
    };

    const docs = await APIFeatures(Withdraw, req.query);
    
    res.status(200).json({
      status: 'success',      
      data: {
        results: docs.length,
        docs
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};

exports.getDepositAddress = async (req, res) => {
  try {
    const network = req.body.value;
    const timeCode = Date.now().toString().slice(-6);
    const referenceCode = `${String(req.user.id).slice(-4)}-${generateVerifyCode()}-${timeCode}`;

    const newData = {
      referenceCode,
      user: req.user.id,
      createdAt: Date.now()
    };
    await ReferenceCode.create(newData);

    res.status(201).json({
      status: 'success',
      data: {
        address: DEPOSIT_ADDRESSES[network],
        referenceCode
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};

exports.createDepositTrx = async (req, res) => {
  try {
    const referenceCode = await ReferenceCode.findOne({ referenceCode: req.body.referenceCode, user: req.user.id });
    if(!referenceCode) {
      return sendError({message: {referenceCode: 'Invalid reference code'}}, 400, req, res);
    }

    req.body.user = req.user.id;
    req.body.accountName = req.user.accountName;
    req.body.createdAt = new Date().toISOString();
    const newDoc = await Deposit.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};

exports.getLastestFriendlyTrx = async (req, res) => {
  try {
    req.query = {
      user: req.user.id,
      limit: LIMIT
    };

    const docs = await APIFeatures(FriendlyTransfer, req.query);
    
    res.status(200).json({
      status: 'success',
      data: {
        results: docs.length,
        docs
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};

exports.getLatestDepositTrx = async (req, res) => {
  try {
    req.query = {
      user: req.user.id,
      limit: LIMIT
    };

    const docs = await APIFeatures(Deposit, req.query);
    
    res.status(200).json({
      status: 'success',      
      data: {
        results: docs.length,
        docs
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};