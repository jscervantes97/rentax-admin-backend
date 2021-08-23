const Property = require('../models/property');
const Development = require('../models/development');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');

exports.addProperty = async (req, res, next) => {
  try {
    let images = [];
    let bannerImages = [];
    let bannerImagesMobile = [];

    req.files.images.map((el) => {
      images.push(el.filename);
    });

    req.files.bannerImages.map((el) => {
      bannerImages.push(el.filename);
    });

    req.files.bannerImagesMobile.map((el) => {
      bannerImagesMobile.push(el.filename);
    });

    const newProperty = new Property({
      title: req.body.title,
      description: req.body.description,
      development: req.body.development,
      highlightModel: req.body.highlightModel,
      distinctive: req.body.distinctive,
      price: req.body.price,
      showPrice: req.body.showPrice,
      typeOfConstruction: req.body.typeOfConstruction,
      landSquareMeters: req.body.landSquareMeters,
      constructionSquareMeters: req.body.constructionSquareMeters,
      rooms: req.body.rooms,
      bathrooms: req.body.bathrooms,
      age: req.body.age,
      extras: req.body.extras,
      videoUrl: req.body.videoUrl,
      slug: req.body.slug,
      virtualTourUrl: req.body.virtualTourUrl,
      amenities: req.body.amenities,
      images: images,
      bannerImages: bannerImages,
      bannerImagesMobile: bannerImagesMobile
    });

    const development = await Development.findByIdAndUpdate(
      req.body.development,
      { "$push": { "properties": newProperty._id } },
      { new: true, runValidators: true }
    );

    await development.save();
    const property = await newProperty.save();

    res.status(201).json({ message: 'Property added', data: property });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getProperties = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const numProperties = await Property.countDocuments();
    const totalPages = Math.ceil(numProperties / limit);

    if (req.query.page) {
      if (skip >= numProperties) throw new Error('This page does not exist');
    }

    let query = await Property.find(queryObj).populate({ path: 'development' }).skip(skip).limit(limit);

    res.status(200).json({
      message: 'Properties fetched',
      data: query,
      totalItems: numProperties,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.searchProperty = async (req, res, next) => {
  try {
    const { development, minPrice, maxPrice } = req.query;

    let queryObj

    if (development) {
      queryObj = { development: development, price: {$gte: minPrice, $lte: maxPrice }};
    } else {
      queryObj = { price: {$gte: minPrice, $lte: maxPrice }};
    }

    let query = await Property.find(queryObj).populate({ path: 'development' })

    res.status(200).json({ message: 'Properties fetched 33', data: query })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('development');

    res.status(200).json({ status: 'success', data: property });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getPropertyUrl = async (req, res, next) => {
  try {
    const property = await Property.findOne({slug: req.params.slug});

    res.status(200).json({ status: 'success', data: property });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.editProperty = async (req, res, next) => {
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
      'development',
      'highlightModel',
      'distinctive',
      'price',
      'showPrice',
      'typeOfConstruction',
      'landSquareMeters',
      'constructionSquareMeters',
      'rooms',
      'bathrooms',
      'age',
      'extras',
      'age',
      'videoUrl',
      'slug',
      'virtualTourUrl',
      'amenities'
    );

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: property });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    await Property.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.uploadImages = async (req, res, next) => {
  if (!req.files.images && !req.files.bannerImages && !req.body.deleteImages) return next();

  const property = await Property.findById(req.params.id);

  let currentImages = property.images;
  let currentBannerImages = property.bannerImages;

  let deleteImages = req.body.deleteImages;
  let deleteBannerImages = req.body.deleteBannerImages;

  if (deleteImages) {
    currentImages = currentImages.filter((val) => !deleteImages.includes(val));
  }

  if (deleteBannerImages) {
    currentBannerImages = currentBannerImages.filter((val) => !deleteBannerImages.includes(val));
  }

  if (req.files.images) {
    req.files.images.map((el) => {
      currentImages.push(el.path);
    });
  }

  if (req.files.bannerImages) {
    req.files.bannerImages.map((el) => {
      currentBannerImages.push(el.path);
    });
  }

  req.body.images = currentImages;
  req.body.bannerImages = currentBannerImages;

  next();
};

exports.addImage = async (req, res, next) => {
  try {
    const id = req.params.id

    const property = await Property.findByIdAndUpdate(
      id,
      { "$push": { "images": req.file.filename } }, 
      { new: true, runValidators: true }
    );

    res.status(201).json({ message: 'Image added', data: property })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.removeImage = async (req, res, next) => {
  try {
    const id = req.params.id
    const property = await Property.findByIdAndUpdate(
      id,
      { "$pull": { "images": req.query.image } },
      { new: true, runValidators: true }
    );

    fs.unlinkSync(`images/${req.query.image}`)

    res.status(200).json({ message: 'Image removed', data: property})
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.addBannerImage = async (req, res, next) => {
  try {
    const id = req.params.id

    const property = await Property.findByIdAndUpdate(
      id,
      { "$push": { "bannerImages": req.file.filename } }, 
      { new: true, runValidators: true }
    );

    res.status(201).json({ message: 'Image added', data: property })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.removeBannerImage = async (req, res, next) => {
  try {
    const id = req.params.id
    const property = await Property.findByIdAndUpdate(
      id,
      { "$pull": { "bannerImages": req.query.image } },
      { new: true, runValidators: true }
    );

    fs.unlinkSync(`images/${req.query.image}`)

    res.status(200).json({ message: 'Image removed', data: property})
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.addBannerImageMobile = async (req, res, next) => {
  try {
    const id = req.params.id

    const property = await Property.findByIdAndUpdate(
      id,
      { "$push": { "bannerImagesMobile": req.file.filename } }, 
      { new: true, runValidators: true }
    );

    res.status(201).json({ message: 'Image added', data: property })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.removeBannerImageMobile = async (req, res, next) => {
  try {
    const id = req.params.id
    const property = await Property.findByIdAndUpdate(
      id,
      { "$pull": { "bannerImagesMobile": req.query.image } },
      { new: true, runValidators: true }
    );

    fs.unlinkSync(`images/${req.query.image}`)

    res.status(200).json({ message: 'Image removed', data: property})
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};
