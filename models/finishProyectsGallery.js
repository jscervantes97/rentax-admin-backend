const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const finishProyectsGallerySchema = new Schema({
    tituloPropiedad : String , 
    srcImage: String,
    nombrePropiedad : String,
    arrayImages : Array
  });
  
  module.exports = mongoose.model('FinishProyectsGallery', finishProyectsGallerySchema);