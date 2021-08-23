const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, 'images');
    } else {
      cb({ error: 'Mime type not supported' });
    }
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  }
});

var upload = multer({ storage: fileStorage }).single('image');

router
  .route('/')
  .post(upload, reviewController.addReview)
  .get(reviewController.getReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .put(upload, reviewController.editReview)
  .delete(reviewController.deleteReview);

module.exports = router;
