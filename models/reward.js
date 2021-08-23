const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewardSchema = new Schema({
  _id: String,
  description: String,
  term: String,
  contentType: Boolean,
  image: String,
  sideImgDesktop: String,
  sideImgMobile: String
});

module.exports = mongoose.model('Reward', rewardSchema);
