const Vacancy = require('../models/vacancy');

exports.addVacancy = async (req, res, next) => {
  try {
    const newVacancy = new Vacancy({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      image: req.file.path
    });

    const vacancy = await newVacancy.save();

    res
      .status(201)
      .json({ message: 'Vacancy added', data: vacancy });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getVacancies = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const numVacancies = await Vacancy.countDocuments();
    const totalPages = Math.ceil(numVacancies / limit);

    // if (req.query.page) {
    //   if (skip >= numDevelopments) throw new Error('This page does not exist');
    // }

    let query = await Vacancy.find(queryObj).skip(skip).limit(limit);

    res.status(200).json({
      message: 'Vacancies fetched',
      data: query,
      totalItems: numVacancies,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getVacancy = async (req, res, next) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);

    res.status(200).json({ status: 'success', data: vacancy });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.editVacancy = async (req, res, next) => {
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
      'location',
      'image'
    );

    const vacancy = await Vacancy.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: vacancy });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.deleteVacancy = async (req, res, next) => {
  try {
    await Vacancy.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};
