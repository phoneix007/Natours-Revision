const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const AppError = require('../AppError');

// password == nameof user.

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const token = generateToken(newUser._id);
    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'please follow rules for signup',
    });
  }
};

exports.login = async (req, res, next) => {
  // email and password is there or not
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // check if user exists or not
  const user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError('Invalid email or password', 400));
  }
  const token = generateToken(user._id);
  res.status(200).json({
    status: 'success',
    message: 'login success',
    token,
  });
};
