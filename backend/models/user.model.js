const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
// const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: [true, 'Please tell us your account name'],
    unique: true
  },
  transactionKey: {
    type: String,
    required: [true, 'Please tell us your first name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phoneNumber: {
    type: String
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role is either: user, admin'
    }, 
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password length must be more or equal than 8'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!
      validator: function(el) {
        const self = this;
        return el === self.password;
      },
      message: 'PasswordConfirm must match with Password'
    }
  },
  tier: {
    type: Number,
    enum: {
      values: [0, 1, 2, 3, 4, 5],
    },
    default: 0
  },
  location: {
    type: String
  },
  createdAt: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true
  }
});

// pre-save middleware
userSchema.pre('save', async function(next) {
  const self =this;
  // Only run this function is password was actually modified.
  if(!self.isModified('password')) return next();

  // Hash the password with cost of 12
  // self.password = await bcrypt.hash(self.password, 12);
  self.password = self.password;

  // Delete passwordConfirm field
  self.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function(next) {
  const self = this;
  // self.find({active: {$ne: false}}); // Show only users active
  next();
});

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // After 10 minutes
  return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;