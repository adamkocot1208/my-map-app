// mapController.js

const mapModel = require('../models/mapModel');
const wktParser = require('wellknown');

/**
 * Get train stations and stops data and send to client.
 */
function getTrainStationsAndStops(req, res) {
    mapModel.getTrainStationsAndStops((err, data) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).json({ error: 'Failed to retrieve data' });
        }

        // Ensure data is an array before mapping
        if (!Array.isArray(data)) {
            return res.status(500).json({ error: 'Data is not an array' });
        }

        // Parse WKT and transform the data
        const parsedData = data.map(station => {
            const coordinates = wktParser.parse(station.geom);
            return {
                id: station.id,
                latitude: coordinates.coordinates[1],
                longitude: coordinates.coordinates[0],
                full_id: station.full_id,
                railway: station.railway,
                name: station.name,
                typ: station.typ
            };
        });
        
        res.json(parsedData); // Ensure this sends an array
    });
}

module.exports = {
    getTrainStationsAndStops,
};