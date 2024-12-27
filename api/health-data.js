const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = async (req, res) => {
    const { userId } = req.query;

    if (req.method === 'GET') {
        try {
            const result = await pool.query(
                'SELECT heart_rate, blood_oxygen FROM health_data WHERE user_id = $1',
                [userId]
            );

            if (result.rows.length === 0) {
                res.status(404).send('No data found for this user');
            } else {
                res.status(200).json(result.rows);
            }
        } catch (error) {
            res.status(500).send(`Error retrieving data: ${error.message}`);
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};