const express = require('express');
const router = express.Router();
const developmentController = require('../controllers/development');
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
  { name: 'images', maxCount: 8 },
  { name: 'mobileImages', maxCount: 8 },
  { name: 'logo', maxCount: 1 },
]);

var uploadSingle = multer({ storage: fileStorage }).single('image');

router
  .route('/')
  .post(upload, developmentController.addDevelopment)
  .get(developmentController.getDevelopments)

router
  .route('/:id')
  .get(developmentController.getDevelopment)
  .put(developmentController.editDevelopment)
  .delete(developmentController.deleteDevelopment)

router.route('/getUrl/:slug').get(developmentController.getDevelopmentUrl)

router.route('/addLogo/:id').put(uploadSingle, developmentController.addLogo)
router.route('/removeLogo/:id').put(uploadSingle, developmentController.RemoveLogo)

router.route('/addImage/:id').put(uploadSingle, developmentController.addImage)
router.route('/removeImage/:id').put(uploadSingle, developmentController.RemoveImage)

router.route('/addMobileImage/:id').put(uploadSingle, developmentController.addMobileImage)
router.route('/removeMobileImage/:id').put(uploadSingle, developmentController.RemoveMobileImage)

module.exports = router;
