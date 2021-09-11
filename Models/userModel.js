const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },

  email: {
    type: String,
    required: [true, 'please provide your email'],
    validate: [validator.isEmail, 'email is invalid'],
    unique: true,
  },
  password: {
    type: String,
    minlength: 4,
    required: [true, ' your password is required'],
  },
  confirmPassword: {
    type: String,
    minlength: 4,
    required: [true, 'confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same',
    },
  },
  role: {
    type: String,
    enum: ['admin , guide , user'],
    default: 'user',
  },
  photo: {
    type: String,
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
