const express = require('express');
const router = express.Router();
const testimonyController = require('../controllers/testimony');
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

// var upload = multer({ storage: fileStorage }).single('image');
var upload = multer({ storage: fileStorage }).fields([
  { name: 'image', maxCount: 4 },
  { name: 'mobileImage', maxCount: 1 },
]);

router
  .route('/')
  .post(upload, testimonyController.addTestimony)
  .get(testimonyController.getTestimonys);

router.get('/gettestimonysforWebsite', testimonyController.getTestimonysforWebsite);

router
  .route('/:id')
  .get(testimonyController.getTestimony)
  .put(upload, testimonyController.editTestimony)
  .delete(testimonyController.deleteTestimony);

module.exports = router;
