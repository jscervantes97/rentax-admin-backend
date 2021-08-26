const FinishProyectsGallery = require('../models/finishProyectsGallery');

exports.addProyect = async (req, res) => {
    try {
      const newFinishProyectsGallery = new FinishProyectsGallery({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        comments: req.body.comments,
      });
      console.log(req.body);
      const contactRequest = await newContactRequest.save();
  
      res
        .status(201)
        .json({ message: 'Proyect added', data: contactRequest });
    } catch (error) {
      res.status(500).json({ status: 'fail ....', message: error });
    }
  };
  
exports.getContactRequests = async (req, res) => {
    try {
      const queryObj = { ...req.query };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
  
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 20;
      const skip = (page - 1) * limit;
  
      const numRequests = await ContactRequest.countDocuments();
      const totalPages = Math.ceil(numRequests / limit);
  
      // if (req.query.page) {
      //   if (skip >= numDevelopments) throw new Error('This page does not exist');
      // }
  
      let query = await ContactRequest.find().skip(skip).limit(limit);
  
      res.status(200).json({
        message: 'Contact Requests fetched',
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
  