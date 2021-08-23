const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogCategory');

router
  .route('/')
  .post(blogController.addCategory)
  .get(blogController.getCategories);

router
  .route('/:id')
  .get(blogController.getCategory)
  .put(blogController.editCategory)
  .delete(blogController.deleteCategory);

module.exports = router;
