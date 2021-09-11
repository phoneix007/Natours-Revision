const jwt = require('jsonwebtoken');
const { promisify } = require('util');
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

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }
  // verification of token

  console.log(token);
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user no longer exists', 401));
    }
    req.user = user;
  } catch (err) {
    return next(new AppError('Invalid token please loggin again', 401));
  }
  next();
};

exports.restrictTo = (role) => (req, res, next) => {
  if (req.user.role !== role)
    return next(new AppError('you are not authorized to delete the tour', 403));

  next();
};
