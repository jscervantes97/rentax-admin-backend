const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vacancySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
    minlength: 2,
  },
  description: String,
  location: String,
  image: String
});

module.exports = mongoose.model('Vacancy', vacancySchema);
