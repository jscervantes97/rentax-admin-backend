const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property');
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
  },
});

var upload = multer({ storage: fileStorage }).fields([
  { name: 'images', maxCount: 20 },
  { name: 'bannerImages', maxCount: 8 },
  { name: 'bannerImagesMobile', maxCount: 8 }
]);

var uploadSingle = multer({ storage: fileStorage }).single('image');

router
  .route('/')
  .post(upload, propertyController.addProperty)
  .get(propertyController.getProperties)

router.route('/search').get(propertyController.searchProperty)

router
  .route('/:id')
  .get(propertyController.getProperty)
  .put(propertyController.editProperty)
  .delete(propertyController.deleteProperty);

router.route('/getUrl/:slug').get(propertyController.getPropertyUrl)

router.route('/addImage/:id').put(uploadSingle, propertyController.addImage)
router.route('/removeImage/:id').put(uploadSingle, propertyController.removeImage)

router.route('/addBannerImage/:id').put(uploadSingle, propertyController.addBannerImage)
router.route('/removeBannerImage/:id').put(uploadSingle, propertyController.removeBannerImage)

router.route('/addBannerImageMobile/:id').put(uploadSingle, propertyController.addBannerImageMobile)
router.route('/removeBannerImageMobile/:id').put(uploadSingle, propertyController.removeBannerImageMobile)

module.exports = router;
