const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  customer: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
    minlength: 2,
  },
  description: String,
  image: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
