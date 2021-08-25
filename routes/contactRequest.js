const express = require('express');
const router = express.Router();
const contactRequest = require('../controllers/contactRequest');

router.post('/add-contact-request', contactRequest.addContactRequest);

module.exports = router;