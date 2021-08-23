const Banner = require('../models/banners');

exports.addBanner = async (req, res, next) => {
  try {

    const image = req.files.image[0].filename
    const mobileImage = req.files.mobileImage[0].filename

    const newBanner = new Banner({
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      image: image,
      mobileImage: mobileImage
    });

    const banner = await newBanner.save();

    res
      .status(201)
      .json({ message: 'Banner added', data: banner });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getBanners = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const numBanners = await Banner.countDocuments();
    const totalPages = Math.ceil(numBanners / limit);

    // if (req.query.page) {
    //   if (skip >= numDevelopments) throw new Error('This page does not exist');
    // }

    let query = await Banner.find(queryObj).skip(skip).limit(limit);

    res.status(200).json({
      message: 'Banners fetched',
      data: query,
      totalItems: numBanners,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getBannersforWebsite = async (req, res, next) => {
  try {
    let mainBanners = await Banner.find({ type: "Main banner" });
    let promoBanners = await Banner.find({ type: "Promo banner" });

    res.status(200).json({
      message: 'Banners fetched',
      mainBanners: mainBanners,
      promoBanners: promoBanners,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    res.status(200).json({ status: 'success', data: banner });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.editBanner = async (req, res, next) => {
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
      'type',
      'image',
      'mobileImage'
    );

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: banner });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};
