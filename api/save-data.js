const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { heartRate, bloodOxygen } = req.body;
        const userId = 1;

        try {
            await pool.query(
                'INSERT INTO health_data (user_id, heart_rate, blood_oxygen) VALUES ($1, $2, $3)',
                [userId, heartRate, bloodOxygen]
            );
            res.status(200).send('Data saved successfully');
        } catch (error) {
            res.status(500).send(`Error saving data: ${error.message}`);
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};