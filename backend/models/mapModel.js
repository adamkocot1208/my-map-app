// mapModel.js

const db = require('../db'); // Assuming you have a db.js for database connection

/**
 * Get all train stations and stops.
 */
function getTrainStationsAndStops(callback) {
    const query = `
        SELECT id, ST_AsText(ST_Transform(geom, 4326)) as geom, full_id, railway, name, typ
        FROM i_kolej_stacje_przystanki
    `;
    db.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        if (Array.isArray(results.rows)) {
            callback(null, results.rows);
        } else {
            callback(new Error('Expected results.rows to be an array'));
        }
    });
}

module.exports = {
    getTrainStationsAndStops,
};
