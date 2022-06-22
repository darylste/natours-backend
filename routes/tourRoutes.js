const express = require('express');
const {
  getAllTours,
  createTour,
  getSingleTour,
  updateTour,
  deleteTour,
  aliasTopTours,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/top-5').get(aliasTopTours, getAllTours);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
