const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/home_2', (req, res, next) => {
  res.render('index_2');
});

router.get('/desarrollo', (req, res, next) => {
  res.render('developing');
});

router.get('/propiedad-detalle', (req, res, next) => {
  res.render('property-detail');
});

router.get('/admin-dashboard', (req, res, next) => {
  res.render('dashboard');
});

router.get('/admin-properties', (req, res, next) => {
  res.render('properties');
});

router.get('/admin-add-property', (req, res, next) => {
  res.render('add-property');
});

router.get('/add-banner', (req, res, next) => {
  res.render('add-banner');
});

router.get('/admin-developments', (req, res, next) => {
  res.render('developments');
});

router.get('/admin-add-development', (req, res, next) => {
  res.render('add-development');
});

module.exports = router;
