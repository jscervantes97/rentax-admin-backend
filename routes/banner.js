const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner');
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
  { name: 'image', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
]);

router
  .route('/')
  .post(upload, bannerController.addBanner)
  .get(bannerController.getBanners);

router.get('/getBannersforWebsite', bannerController.getBannersforWebsite);

router
  .route('/:id')
  .get(bannerController.getBanner)
  .put(upload, bannerController.editBanner)
  .delete(bannerController.deleteBanner);

module.exports = router;
