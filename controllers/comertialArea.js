const ComertialArea= require('../models/comertialArea');

exports.addComertialArea = async (req, res) => {
  try {
    console.log(req.files.image)
    const image = req.files.image[0].filename ;

    const newComertialArea = new ComertialArea({
      title: req.body.title,
      description: req.body.description,
      image: image,
      urlCentro : req.body.urlCentro
    });

    const comertialArea = await newComertialArea.save();

    res
      .status(201)
      .json({ message: 'ComertialArea added', data: comertialArea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getComertialAreas = async (req, res, ) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const numComertialAreas = await ComertialArea.countDocuments();
    const totalPages = Math.ceil(numComertialAreas / limit);

    // if (req.query.page) {
    //   if (skip >= numDevelopments) throw new Error('This page does not exist');
    // }

    let query = await ComertialArea.find(queryObj).skip(skip).limit(limit);

    res.status(200).json({
      message: 'ComertialAreas fetched',
      data: query,
      totalItems: numComertialAreas,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};


exports.getComertialArea = async (req, res) => {
  try {
    const comertialArea = await ComertialArea.findById(req.params.id);

    res.status(200).json({ status: 'success', data: comertialArea });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.editComertialArea = async (req, res) => {
  try {
    const filterObj = (obj, ...allowedFields) => {
      const newObj = {};
      Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
      });
      return newObj;
    };

    if (req.file) {
      req.body.image = req.file.path;
    }

    const filteredBody = filterObj(
      req.body,
      'title',
      'description',
      'image',
      'urlCentro'
    );

    const comertialArea = await ComertialArea.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: comertialArea });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.deleteComertialArea = async (req, res) => {
  try {
    await ComertialArea.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};
