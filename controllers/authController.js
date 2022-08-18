const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and passowrd', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // read token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // check token exists
  if (!token) {
    return next(new AppError('You must be logged in.', 401));
  }
  // verify token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  // check user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) next(new AppError('User no longer exists', 401));
  // check if user password has been changed
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(new AppError('Password changed recently, login again.', 401));
  }
  // allow access
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) next(new AppError('No user found with this email address', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Go to ${resetURL} to reset. \nIf you didn't send this request please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Natours: reset your password.',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email address.',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save();

    return next(
      new AppError(
        'There was an error sending the email. Please try again later',
        500
      )
    );
  }
});

exports.resetPassword = (req, res, next) => {};
