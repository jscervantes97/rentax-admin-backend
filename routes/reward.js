const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/reward');
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

var upload = multer({ storage: fileStorage }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'sideImgDesktop', maxCount: 1 },
  { name: 'sideImgMobile', maxCount: 1 }
]);

router.put('/', upload, rewardController.uploadImages ,rewardController.addReward);

router.get('/:id', rewardController.getReward);

module.exports = router;
