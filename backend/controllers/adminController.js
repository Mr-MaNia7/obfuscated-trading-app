const Telnyx = require('telnyx');
const sendEmail = require('../utils/sendEmail');
const sendError = require('./assets/errorController');
const LoginLog = require('../models/loginLog.model');
const factory = require('./assets/handlerFactory');

exports.sendMessageToUser = async (req, res) => {
  const telnyx = Telnyx(process.env.TELNYX_API_KEY);
  try {
    const { phoneNumber, message } = req.body;

    telnyx.messages.create(
    {
        'from': process.env.TELNYX_NUMBER, // Your Telnyx number
        'to': phoneNumber,
        'text': message
      },
      function(err, response) {
        if(err) {
          console.log(err);
          return sendError(err, 404, req, res);
        }
        // asynchronously called
        if(response) {
          res.status(200).json({
            status: 'success',
            data: {
              detail: `Message sent to ${phoneNumber} successfully`
            }
          });
        }
      }
    );
  } catch(err) {
    sendError(err, 404, req, res);
  }
};

exports.sendEmailToUser = async (req, res) => {
  try {
    const { email, message } = req.body;
    if(process.env.NODE_ENV === 'production') {
      await sendEmail({
        email,
        subject: 'CryptoEver Support',
        title: 'Customer Support',
        text: message,
        code: ''
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        detail: `Message sent to ${email} successfully`
      }
    })
  } catch (err) {
    sendError(err, 404, req, res);
  }
};

exports.getAllLoginLogs = factory.getAll(LoginLog);