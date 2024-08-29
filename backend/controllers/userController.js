const multer = require('multer');
const geoip = require('geoip-lite');
const fs = require('fs');
// const sharp = require('sharp');
const User = require('../models/user.model');
const Message = require('../models/message.model');
const Wallet = require('../models/wallet.model');
const { createSendToken } = require('./authController');
const sendError = require('./assets/errorController');
const factory = require('./assets/handlerFactory');
const { userTiers } = require('../utils/staticData');
const { getPrices } = require('../services/interval');

// const multerStorage = multer.memoryStorage();
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'client/public/image/users');
  },
  filename: function (req, file, cb) {
    const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  }
})
const multerFilter = (req, file, callback) => {
  if(file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new Error('Not an image. Please upload only images'), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');
// exports.resizeUserPhoto = async (req, res, next) => {
//   // console.log(req.file);
//   try {
//     if(!req.file) return next();
//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//     await sharp(req.file.buffer)
//       .resize(500, 500)
//       .toFormat('jpeg')
//       // .jpeg({quality: 90})
//       .toFile(`client/public/image/users/${req.file.filename}`);

//     next();
//   } catch(err) {
//     sendError(err, 400, req, res);
//   }
// };

const filterObj = (obj, ...allowFields) => {
  const newObj= {};
  Object.keys(obj).forEach(el => {
    if(allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.upgradeUserTier = async (req, res) => {
  try {
    const { tier, asset } = req.body;
    const balance = await Wallet.findOne({ user: req.user.id }).select('-user');
    const coinPrices = await getPrices();
    // check if balance is sufficient
    const isSufficientBalance = balance[asset] * coinPrices[asset]?.price > userTiers[tier]?.required;
    if(!isSufficientBalance) {
      return sendError({message: {balance: 'Insufficient balance'}}, 400, req, res);
    }

    const newAssetBalance = Number(balance[asset] - (userTiers[tier]?.required / coinPrices[asset]?.price)).toFixed(8);

    await Wallet.findByIdAndUpdate(balance._id, { [asset]: newAssetBalance });

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { tier }, {
      new: true,
      runValidator: true
    });

    createSendToken(updatedUser, 200, res);
  } catch (err) {
    sendError(err, 400, req, res);
  }
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res, next) => {
  try {
    // console.log(req.file);
    // 1) Create error if user Posts password data
    if(req.body.password || req.body.passwordConfirm) {
      return next(
        sendError({message: 'This route is not for password updates. Please use /updateMyPassword'}, 400, req, res)
      );
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filterBody = filterObj(req.body, 'name', 'email');
    if(req.file) {
      filterBody.photo = req.file.filename;
    }
    // 3) Update User document
    const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
      new: true, runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updateUser
      }
    });
  } catch(err) {
    sendError(err, 404, req, res);
  }
};

exports.updateTrxKey = async (req, res) => {
  try {
    const { trxKey, trxKeyConfirm } = req.body;
    if(!trxKey || !trxKeyConfirm) {
      return sendError({message: {form: 'Please provide transaction key and confirmation'}}, 400, req, res);
    }

    if(trxKey !== trxKeyConfirm) {
      return sendError({message: {transactionKey: 'Transaction keys must match'}}, 400, req, res);
    }
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { transactionKey: trxKey }, {
      new: true, runValidators: true
    });
        
    createSendToken(updatedUser, 200, res);
  } catch(err) {
    sendError(err, 404, req, res);
  }
};

exports.submitMessage = async (req, res) => {
  try {
    const ipAddressString = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipAddress = ipAddressString.split(',')[0];

    const geo = geoip.lookup(ipAddress);
    const location = `${geo?.city} ${geo?.country} -----timezone: ${geo?.timezone}------`;

    const messageData = {
      topic: req.body.topic,
      message: req.body.message,
      user: req.user.id,
      ip: ipAddress,
      location,
      email: req.user.email,
      createdAt: Date.now()
    };

    const newDoc = await Message.create({ ...messageData });
    res.status(200).json({
      status: 'success',
      data: {
        topic:  newDoc.topic
      }
    });
  } catch(err) {
    sendError(err, 404, req, res);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {active: false});
    res.status(204).json({
      status: 'success',
      message: null
    });
  } catch(err) {
    sendError(err, 404, req, res);
  }
};

exports.createUser = async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route si not defined! Please use /signup instead.'
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// Do not update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);