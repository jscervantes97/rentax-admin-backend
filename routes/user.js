const express = require('express');
const router = express.Router();
const multer = require('multer');

const authController = require('../controllers/auth');
const userController = require('../controllers/user');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUser);

router.patch('/updateMyAccount', userController.updateMe);

router.delete('/deleteMyAccount', userController.deleteMyUser);

router.post('/sendQuoteRequest', userController.sendQuoteRequest);

router.post('/sendCustomerRef', userController.sendCustomerRef);

module.exports = router;
