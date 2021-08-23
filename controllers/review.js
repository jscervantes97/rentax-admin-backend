const Review = require('../models/review');

exports.addReview = async (req, res, next) => {
  try {
    const newReview = new Review({
      customer: req.body.customer,
      description: req.body.description,
      image: req.file.path
    });

    const review = await newReview.save();

    res
      .status(201)
      .json({ message: 'Review added', data: review });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    console.log('ssaass')
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const numReviews = await Review.countDocuments();
    const totalPages = Math.ceil(numReviews / limit);

    // if (req.query.page) {
    //   if (skip >= numDevelopments) throw new Error('This page does not exist');
    // }

    let query = await Review.find(queryObj).skip(skip).limit(limit);

    res.status(200).json({
      message: 'Reviews fetched',
      data: query,
      totalItems: numReviews,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    res.status(200).json({ status: 'success', data: review });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.editReview = async (req, res, next) => {
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
      'customer',
      'description',
      'image'
    );

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: review });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};
