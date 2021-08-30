const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comertialAreaSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
    minlength: 2,
  },
  description: String,
  image: String,
  urlCentro : String 
});

module.exports = mongoose.model('ComertialArea', comertialAreaSchema);
