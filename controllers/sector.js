const { compareSync } = require('bcrypt');
const Sector = require('../models/sector');

exports.addSector = async (req, res, next) => {
  try {
    const newSector = new Sector({
      title: req.body.title
    });

    const sector = await newSector.save();

    res
      .status(201)
      .json({ message: 'Sector added', data: sector });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getSectors = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const numSectors = await Sector.countDocuments();
    const totalPages = Math.ceil(numSectors / limit);

    // if (req.query.page) {
    //   if (skip >= numDevelopments) throw new Error('This page does not exist');
    // }

    let query = await Sector.find().skip(skip).limit(limit);

    res.status(200).json({
      message: 'Sectors fetched',
      data: query,
      totalItems: numSectors,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getSector = async (req, res, next) => {
  try {
    const sector = await Sector.findById(req.params.id);

    res.status(200).json({ status: 'success', data: sector });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.editSector = async (req, res, next) => {
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

    const sector = await Sector.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: sector });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.deleteSector = async (req, res, next) => {
  try {
    await Sector.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};
