const express = require('express');
const router = express.Router();
const pool = require('../db');

// Создание организации
router.post('/', async (req, res) => {
    const { name, comment } = req.body;
    const result = await pool.query('INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING *', [name, comment]);
    res.status(201).json(result.rows[0]);
});

// Чтение всех организаций
router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM organizations WHERE deleted_at IS NULL');
    res.json(result.rows);
});

// Обновление организации
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, comment } = req.body;
    const result = await pool.query('UPDATE organizations SET name = $1, comment = $2 WHERE id = $3 RETURNING *', [name, comment, id]);
    res.json(result.rows[0]);
});

// Мягкое удаление организации
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('UPDATE organizations SET deleted_at = NOW() WHERE id = $1', [id]);
    res.status(204).send();
});

module.exports = router;