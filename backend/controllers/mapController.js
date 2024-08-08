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
            const geometry = wktParser.parse(station.geom);
            return {
                id: station.id,
                latitude: geometry.coordinates[1],
                longitude: geometry.coordinates[0],
                railway: station.railway,
                name: station.name,
            };
        });

        res.json(parsedData); // Ensure this sends an array
    });
}

/**
 * Get train lines data and send to client.
 */
function getTrainLines(req, res) {
    mapModel.getTrainLines((err, data) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).json({ error: 'Failed to retrieve data' });
        }

        const parsedData = data.map(feature => {
            const geometry = wktParser.parse(feature.geom);
                return {
                    id: feature.id,
                    coordinates: geometry.coordinates,
                    nr: feature.nr,
                    elektr: feature.elektr,
                    type: geometry.type
                };
        });

        res.json(parsedData);
    });
}

/**
 * Get Balon's physographic areas data and send to client.
 */
function getBalonsPhysographicAreas(req, res) {
    mapModel.getBalonsPhysographicAreas((err, data) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).json({ error: 'Failed to retrieve data' });
        }

        const parsedData = data.map(feature => {
            const geometry = wktParser.parse(feature.geom);
            return {
                id: feature.id,
                coordinates: geometry.coordinates,
                name: feature.name,
                layer: feature.layer,
                type: geometry.type
            };
        });

        res.json(parsedData);
    });
}


module.exports = {
    getTrainStationsAndStops,
    getTrainLines,
    getBalonsPhysographicAreas
};