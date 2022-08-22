const Review = require('../models/reviewModel');
const {
  updateOne,
  deleteOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.setUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = createOne(Review);
exports.getAllReviews = getAll(Review);
exports.getSingleReview = getOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
