const mongoose = require('mongoose');
const Tour = require('./tourModel');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minlength: [10, 'Review must be at least 10 characters long.'],
      maxlength: [1000, 'Review cannot exceed 1000 characters.'],
      required: [true, 'Review must contain a message.'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating cannot be higher than 5.'],
      required: [true, 'Review must have a rating.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: Tour,
      required: [true, 'Review must be linked to a tour.'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: User,
      required: [true, 'Review must be linked to a user.'],
    },
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAvgRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAvg: stats[0].nRating,
      ratingQuantity: stats[0].avgRating,
    });
  } else {
    ratingQuantity = 0;
    ratingAvg = 4.5;
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAvgRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAvgRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
