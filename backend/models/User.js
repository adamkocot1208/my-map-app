const pool = require('../db');

class User {
    static async create(email, username, password) {
        const result = await pool.query(
            `INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *`,
            [email, username, password]
        );
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        return result.rows[0];
    }

    static async updatePassword(id, password) {
        const result = await pool.query(
            `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`,
            [password, id]
        );
        return result.rows[0];
    }

    static async confirmUser(id) {
        const result = await pool.query(
            `UPDATE users SET confirmed = true WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }
}

module.exports = User;
