const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannersSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
    minlength: 2,
  },
  description: String,
  type: {
    type: String,
    enum: ['Main banner', 'Promo banner', 'Reward banner']
  },
  image: String,
  mobileImage: String
});

module.exports = mongoose.model('Banners', bannersSchema);
