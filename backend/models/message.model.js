const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, 'Topic is required.']
  },
  message: {
    type: String,
    required: [true, 'Message required.']
  },
  email: {
    type: String,
    required: [true, 'User email is required.']
  },
  ip: {
    type: String,
    required: [true, 'Ip address is required.']
  },
  location: {
    type: String,
    required: [true, 'Location is required.']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Message must belong to a user.']
  },
  createdAt: Date
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;