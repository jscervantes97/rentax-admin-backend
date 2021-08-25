const ContactRequest = require('../models/contactRequest');

exports.addContactRequest = async (req, res) => {
    try {
      const newContactRequest = new ContactRequest({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        comments: req.body.comments,
      });
      console.log(req.body);
      const contactRequest = await newContactRequest.save();
  
      res
        .status(201)
        .json({ message: 'Contact Request added', data: contactRequest });
    } catch (error) {
      res.status(500).json({ status: 'fail ....', message: error });
    }
  };
  