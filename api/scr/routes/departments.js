const express = require('express');
const router = express.Router();
const pool = require('../db');

// Создание отдела
router.post('/', async (req, res) => {
    const { name, organization_id, parent_id, comment } = req.body;
    try {
        const result = await pool.query('INSERT INTO departments (name, organization_id, parent_id, comment) VALUES ($1, $2, $3, $4) RETURNING *', [name, organization_id, parent_id, comment]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Чтение всех отделов
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM departments WHERE deleted_at IS NULL');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Обновление отдела
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, organization_id, parent_id, comment } = req.body;
    try {
        const result = await pool.query('UPDATE departments SET name = $1, organization_id = $2, parent_id = $3, comment = $4 WHERE id = $5 RETURNING *', [name, organization_id, parent_id, comment, id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Мягкое удаление отдела
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE departments SET deleted_at = NOW() WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;