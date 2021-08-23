const Role = require('../models/role');

exports.addRole = async (req, res, next) => {
  try {
    const role = new Role(req.body);

    const newRole = await role.save();

    res.status(201).json({ message: 'Development added', data: newRole });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};

// exports.getRoles = async (req, res, next) => {
//   try {

//   } catch (error) {
//     res.status(500).json({ status: 'fail', message: error });
//   }
// };

exports.getRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);

    res.status(201).json({ message: 'Development added', data: newRole });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error });
  }
};
