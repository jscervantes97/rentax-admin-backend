const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testimonySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
    minlength: 2,
  },
  description: String,
  image: String,
});

module.exports = mongoose.model('Testimony', testimonySchema);
