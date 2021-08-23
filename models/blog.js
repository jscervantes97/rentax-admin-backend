const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
    minlength: 2,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'BlogCategory'
  },
  description: String,
  image: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Blog', blogSchema);
