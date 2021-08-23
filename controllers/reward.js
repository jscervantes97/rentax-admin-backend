const Reward = require('../models/reward');

exports.addReward = async (req, res, next) => {
  try {
    const body = req.body;

    let id = "housesinReward"

    let reward = await Reward.updateOne({_id: id}, body, { upsert: true });

    res.status(200).json({ status: 'success', data: reward })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'fail', message: error });
  }
};

exports.getReward = async (req, res, next) => {
  try {
    const reward = await Reward.findById(req.params.id);

    res.status(200).json({ status: 'success', data: reward })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error })
  }
};

exports.uploadImages = async (req, res, next) => {
  if (!req.files) return next();

  console.log(req.files)

  if (req.files.image) {
    req.body.image = req.files.image[0].path;
  }

  if (req.files.sideImgDesktop) {
    req.body.sideImgDesktop = req.files.sideImgDesktop[0].path;
  }

  if (req.files.sideImgMobile) {
    req.body.sideImgMobile = req.files.sideImgMobile[0].path;
  }

  next();
}
