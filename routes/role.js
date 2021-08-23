const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role');

router.post('/add-role', roleController.addRole);

router.get('/:id', roleController.getRole);

module.exports = router;
