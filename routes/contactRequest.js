const express = require('express');
const router = express.Router();
const contactRequest = require('../controllers/contactRequest');

router.get('/',contactRequest.getContactRequests)
router.post('/add-contact-request', contactRequest.addContactRequest);

module.exports = router;