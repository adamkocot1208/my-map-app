// mapRoutes.js

const express = require('express');
const mapController = require('../controllers/mapController');

const router = express.Router();

router.get('/api/trainStationsAndStops', mapController.getTrainStationsAndStops);
router.get('/api/trainLines', mapController.getTrainLines);
router.get('/api/balonsPhysographicAreas', mapController.getBalonsPhysographicAreas);

module.exports = router;
