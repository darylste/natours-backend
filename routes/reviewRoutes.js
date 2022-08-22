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

router.use(protect);
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setUserIds, createReview);

router
  .route('/:id')
  .get(getSingleReview)
  .patch(restrictTo('admin', 'user'), updateReview)
  .delete(restrictTo('admin', 'user'), deleteReview);

module.exports = router;
