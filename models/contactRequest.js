const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const contactRequestdSchema = new Schema({
    _id: String,
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please tell us your phone number!'],
    },
    comments: String 
  });
  
  module.exports = mongoose.model('ContactRequest', contactRequestdSchema);