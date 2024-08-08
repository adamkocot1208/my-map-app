// mapRoutes.js

const express = require('express');
const mapController = require('../controllers/mapController');

const router = express.Router();

/**
 * Route to get train stations and stops.
 */
router.get('/api/trainStationsAndStops', mapController.getTrainStationsAndStops);

module.exports = router;
