const Post = require('../models/blog');

exports.addPost = async (req, res, next) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      image: req.file.path
    });

    const post = await newPost.save();

    res
      .status(201)
      .json({ message: 'Post added', data: post });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const numPosts = await Post.countDocuments();
    const totalPages = Math.ceil(numPosts / limit);

    // if (req.query.page) {
    //   if (skip >= numDevelopments) throw new Error('This page does not exist');
    // }

    let query = await Post.find(queryObj).sort({date: -1}).skip(skip).limit(limit).populate('category');

    res.status(200).json({
      message: 'Posts fetched',
      data: query,
      totalItems: numPosts,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category');

    res.status(200).json({ status: 'success', data: post });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.editPost = async (req, res, next) => {
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
      'category',
      'description',
      'image'
    );

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: post });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};
