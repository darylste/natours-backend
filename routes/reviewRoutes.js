const express = require('express');
const {
  getAllReviews,
  getSingleReview,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

router.route('/:id').get(getSingleReview).delete(deleteReview);

module.exports = router;
