const express = require('express');
const router = express.Router();
const sectorController = require('../controllers/sector');

router
  .route('/')
  .post(sectorController.addSector)
  .get(sectorController.getSectors);

router
  .route('/:id')
  .get(sectorController.getSector)
  .put(sectorController.editSector)
  .delete(sectorController.deleteSector);

module.exports = router;
