const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMyDetails = catchAsync(async (req, res, next) => {
  // create error if password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Cannot update password on this route', 400));
  }
  // update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const userUpdated = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: userUpdated,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });

  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined.',
  });
});

exports.getSingleUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined.',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined.',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined.',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined.',
  });
};
