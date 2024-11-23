const express = require('express');
const router = express.Router();
const pool = require('../db');

// Создание должности
router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query('INSERT INTO positions (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Чтение всех должностей
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM positions');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Обновление должности
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = await pool.query('UPDATE positions SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Мягкое удаление должности
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE positions SET deleted_at = NOW() WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;