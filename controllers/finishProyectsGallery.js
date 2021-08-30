const FinishProyectsGallery = require('../models/finishProyectsGallery');

exports.addProyect = async (req, res) => {
    try {
      console.log(req)
      const image = req.files.principalImage[0].filename ;
      const arrayImages = [] ;
      for(var i = 0 ; i < req.files.images.length ; i++){
        arrayImages.push(
          {
            'src' : req.files.images[i].filename
          }
        );
      }
      const newFinishProyectsGallery = new FinishProyectsGallery({
        tituloPropiedad : req.body.tituloPropiedad , 
        srcImage: image,
        nombrePropiedad : req.body.nombrePropiedad,
        arrayImages : arrayImages
      });
      const proyectRequest = await newFinishProyectsGallery.save();
  
      res
        .status(201)
        .json({ message: 'Proyect added', data: proyectRequest });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'fail ....', message: error });
    }
  };
  
exports.getFullGallery = async (req, res) => {
    try {
      const queryObj = { ...req.query };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
  
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 20;
      const skip = (page - 1) * limit;
  
      const numRequests = await FinishProyectsGallery.countDocuments();
      const totalPages = Math.ceil(numRequests / limit);
  
      // if (req.query.page) {
      //   if (skip >= numDevelopments) throw new Error('This page does not exist');
      // }
  
      let query = await FinishProyectsGallery.find().skip(skip).limit(limit);
  
      res.status(200).json({
        message: 'FinishProyectsGallery Requests fetched',
        data: query,
        totalItems: numRequests,
        page: page,
        totalPages: totalPages,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'fail', message: error });
    }
};
  