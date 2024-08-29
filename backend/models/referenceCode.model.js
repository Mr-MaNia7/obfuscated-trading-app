const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const referenceCodeSchema = new mongoose.Schema({
  referenceCode: {
    type: String,
    required: [true, 'Reference code is required.']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reference Code must belong to a user.']
  },
  createdAt: Date
});

const ReferenceCode = mongoose.model('ReferenceCode', referenceCodeSchema);

module.exports = ReferenceCode;