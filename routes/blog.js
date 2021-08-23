const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
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
  .post(upload, blogController.addPost)
  .get(blogController.getPosts);

router
  .route('/:id')
  .get(blogController.getPost)
  .put(upload, blogController.editPost)
  .delete(blogController.deletePost);

module.exports = router;
