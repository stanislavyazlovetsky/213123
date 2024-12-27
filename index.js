const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Для подключения к PostgreSQL

require('dotenv').config(); // Для загрузки переменных окружения из .env

const app = express();
app.use(bodyParser.json()); // Для обработки JSON-тел запросов

// Настройка подключения к PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Использование строки подключения из переменной окружения
});

// Маршрут для POST-запроса на сохранение данных
app.post('/api/save-data', async (req, res) => {
    const { heartRate, bloodOxygen } = req.body; // Получение данных из тела запроса
    const userId = 1; // Для примера — жёстко заданный userId

    try {
        // Выполнение SQL-запроса для вставки данных
        await pool.query(
            'INSERT INTO health_data (user_id, heart_rate, blood_oxygen) VALUES ($1, $2, $3)',
            [userId, heartRate, bloodOxygen]
        );
        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).send(`Error saving data: ${error.message}`);
    }
});

// Маршрут для GET-запроса на получение данных
app.get('/api/health-data', async (req, res) => {
    const userId = req.query.userId; // Получение userId из параметров запроса

    try {
        // Выполнение SQL-запроса для получения данных
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
        console.error('Database Error:', error);
        res.status(500).send(`Error retrieving data: ${error.message}`);
    }
});

// Настройка сервера для прослушивания запросов
const PORT = process.env.PORT || 3000; // Использование порта из переменной окружения или 3000 по умолчанию
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});