const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
    minlength: 2,
  }
});

module.exports = mongoose.model('BlogCategory', blogCategorySchema);
