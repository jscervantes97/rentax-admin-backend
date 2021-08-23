const express = require('express');
const router = express.Router();
const vacancyController = require('../controllers/vacancy');
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
      console.log(file.mimetype);
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
  .post(upload, vacancyController.addVacancy)
  .get(vacancyController.getVacancies);

router
  .route('/:id')
  .get(vacancyController.getVacancy)
  .put(upload, vacancyController.editVacancy)
  .delete(vacancyController.deleteVacancy);

module.exports = router;
