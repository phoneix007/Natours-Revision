const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router();
const tourController = require('../Controllers/tourController');

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour
  );

module.exports = router;
