const Testimony = require('../models/testimony');

exports.addTestimony = async (req, res) => {
  try {
    console.log(req.files.image)
    const image = req.files.image[0].filename ;

    const newTestimony = new Testimony({
      title: req.body.title,
      description: req.body.description,
      image: image,
    });

    const testimony = await newTestimony.save();

    res
      .status(201)
      .json({ message: 'Testimony added', data: testimony });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getTestimonys = async (req, res, ) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const numTestimonys = await Testimony.countDocuments();
    const totalPages = Math.ceil(numTestimonys / limit);

    // if (req.query.page) {
    //   if (skip >= numDevelopments) throw new Error('This page does not exist');
    // }

    let query = await Testimony.find(queryObj).skip(skip).limit(limit);

    res.status(200).json({
      message: 'Testimonys fetched',
      data: query,
      totalItems: numTestimonys,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getTestimonysforWebsite = async (req, res) => {
  try {
    let mainTestimonys = await Testimony.find({ type: "Main Testimony" });
    let promoTestimonys = await Testimony.find({ type: "Promo Testimony" });

    res.status(200).json({
      message: 'Testimonys fetched',
      mainTestimonys: mainTestimonys,
      promoTestimonys: promoTestimonys,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getTestimony = async (req, res) => {
  try {
    const testimony = await Testimony.findById(req.params.id);

    res.status(200).json({ status: 'success', data: testimony });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.editTestimony = async (req, res) => {
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
    );

    const testimony = await Testimony.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: testimony });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.deleteTestimony = async (req, res) => {
  try {
    await Testimony.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};
