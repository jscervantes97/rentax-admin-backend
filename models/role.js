const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
    minlength: 3,
  },
  permitedModules: {
    type: Array,
  },
});

module.exports = mongoose.model('Role', roleSchema);
