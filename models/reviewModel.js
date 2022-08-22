const mongoose = require('mongoose');

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
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: Tour,
        required: [true, 'Review must be linked to a tour.'],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: User,
        required: [true, 'Review must be linked to a user.'],
      },
    ],
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
