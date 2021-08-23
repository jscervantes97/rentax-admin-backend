const BlogCategory = require('../models/blogCategory');

exports.addCategory = async (req, res, next) => {
  try {
    const newCategory = new BlogCategory({
      title: req.body.title
    });

    const category = await newCategory.save();

    res
      .status(201)
      .json({ message: 'Category added', data: category });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    // const queryObj = { ...req.query };
    // excludedFields.forEach((el) => delete queryObj[el]);

    let query = await BlogCategory.find();
    res.status(200).json({
      message: 'Categories fetched',
      data: query
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await BlogCategory.findById(req.params.id);

    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.editCategory = async (req, res, next) => {
  try {
    const filterObj = (obj, ...allowedFields) => {
      const newObj = {};
      Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
      });
      return newObj;
    };

    const filteredBody = filterObj(
        req.body,
        'title'
      );

    const category = await BlogCategory.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await BlogCategory.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};
