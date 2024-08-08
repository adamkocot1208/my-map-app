// mapModel.js

const db = require('../db'); // Assuming you have a db.js for database connection

/**
 * Get all train stations and stops.
 */
function getTrainStationsAndStops(callback) {
    const query = `
        SELECT id, ST_AsText(ST_Transform(geom, 4326)) as geom, railway, name
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

/**
 * Get train lines.
 */
function getTrainLines(callback) {
    const query = `
        SELECT id, ST_AsText(ST_Transform(geom, 4326)) as geom, nr, elektr
        FROM i_linie_kolejowe
    `;
    db.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results.rows);
    });
}

/**
 * Get physograpic area (Balon).
 */
function getBalonsPhysographicAreas(callback) {
    const query = `
        SELECT id, ST_AsText(ST_Transform(geom, 4326)) as geom, name, layer
        FROM i_podzial_fizjograficzny_balon
    `;
    db.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results.rows);

    });
}

module.exports = {
    getTrainStationsAndStops,
    getTrainLines,
    getBalonsPhysographicAreas
};
