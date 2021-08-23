const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
    minlength: 2,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
    minlength: 2,
    unique: true
  },
  description: String,
  development: {
    type: mongoose.Schema.ObjectId,
    ref: 'Development'
  },
  highlightModel: Boolean,
  distinctive: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  showPrice: Boolean,
  typeOfConstruction: String,
  landSquareMeters: String,
  constructionSquareMeters: String,
  rooms: Number,
  bathrooms: Number,
  age: Date,
  extras: Array,
  videoUrl: String,
  virtualTourUrl: String,
  amenities: Array,
  images: [String],
  bannerImages: [String],
  bannerImagesMobile: [String]
});

// propertySchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'development'
//   })

//   next();
// })

module.exports = mongoose.model('Property', propertySchema);
