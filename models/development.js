const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const developmentSchema = new Schema({
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
  images: [String],
  mobileImages: [String],
  logoImage: String,
  videoUrl: String,
  status: String,
  sector: {
    type: mongoose.Schema.ObjectId,
    ref: 'Sector'
  },
  properties: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Property'
    }
  ],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

developmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'properties'
  })

  next();
})

developmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sector'
  })

  next();
})

module.exports = mongoose.model('Development', developmentSchema);
