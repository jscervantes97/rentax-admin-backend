const { compareSync } = require('bcrypt');
const Development = require('../models/development');
const fs = require('fs');

exports.addDevelopment = async (req, res, next) => {
  try {
    let images = [];
    let mobileImages = [];

    req.files.images.map((el) => {
      images.push(el.filename);
    });

    req.files.mobileImages.map((el) => {
      mobileImages.push(el.filename);
    });

    const logoImage = req.files.logo[0].filename;

    let location = JSON.parse(req.body.location);

    const newDevelopment = new Development({
      title: req.body.title,
      description: req.body.description,
      images: images,
      mobileImages: mobileImages,
      logoImage: logoImage,
      sector: req.body.sector,
      videoUrl: req.body.videoUrl,
      slug: req.body.slug,
      properties: req.body.properties,
      location: location
    });

    const development = await newDevelopment.save();

    res
      .status(201)
      .json({ message: 'Development added', data: development });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getDevelopments = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const numDevelopments = await Development.countDocuments();
    const totalPages = Math.ceil(numDevelopments / limit);

    // if (req.query.page) {
    //   if (skip >= numDevelopments) throw new Error('This page does not exist');
    // }

    let query = await Development.find().skip(skip).limit(limit);

    res.status(200).json({
      message: 'Developments fetched',
      data: query,
      totalItems: numDevelopments,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getDevelopment = async (req, res, next) => {
  try {
    const development = await Development.findById(req.params.id);

    res.status(200).json({ status: 'success', data: development });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getDevelopmentUrl = async (req, res, next) => {
  try {
    const development = await Development.findOne({slug: req.params.slug});

    res.status(200).json({ status: 'success', data: development });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.editDevelopment = async (req, res, next) => {
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
      'title',
      'description',
      'status',
      'sector',
      'location',
      'videoUrl',
      'slug'
    );

    const development = await Development.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: development });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.deleteDevelopment = async (req, res, next) => {
  try {
    await Development.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.addLogo = async (req, res, next) => {
  try {
    const id = req.params.id
    const development = await Development.findByIdAndUpdate(
      id,
      { "logoImage": req.file.filename },
      { new: true, runValidators: true }
    );

    res.status(201).json({ message: 'Logo added', data: development})
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.RemoveLogo = async (req, res, next) => {
  try {
    const id = req.params.id
    const development = await Development.findByIdAndUpdate(
      id,
      { $unset: { logoImage: 1 }},
      { new: true, runValidators: true }
    );

    fs.unlinkSync(`images/${req.query.image}`)

    res.status(200).json({ message: 'Logo removed', data: development})
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.addImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const development = await Development.findByIdAndUpdate(
      id,
      { "$push": { "images": req.file.filename } },
      { new: true, runValidators: true }
    );

    res.status(201).json({ message: 'Image added', data: development})
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.RemoveImage = async (req, res, next) => {
  try {
    const id = req.params.id 
    const development = await Development.findByIdAndUpdate(
      id,
      { "$pull": { "images": req.query.image } },
      { new: true, runValidators: true }
    );

    fs.unlinkSync(`images/${req.query.image}`)

    res.status(200).json({ message: 'Image removed', data: development})
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.addMobileImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const development = await Development.findByIdAndUpdate(
      id,
      { "$push": { "mobileImages": req.file.filename } },
      { new: true, runValidators: true }
    );

    res.status(201).json({ message: 'Image added', data: development})
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.RemoveMobileImage = async (req, res, next) => {
  try {
    const id = req.params.id 
    const development = await Development.findByIdAndUpdate(
      id,
      { "$pull": { "mobileImages": req.query.image } },
      { new: true, runValidators: true }
    );

    fs.unlinkSync(`images/${req.query.image}`)

    res.status(200).json({ message: 'Image removed', data: development})
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};
