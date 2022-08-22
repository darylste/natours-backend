const express = require('express');
const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  setUserIds,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setUserIds, createReview);

router
  .route('/:id')
  .get(getSingleReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = router;
