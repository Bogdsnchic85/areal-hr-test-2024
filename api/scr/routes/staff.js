const express = require('express');
const router = express.Router();
const pool = require('../db');

// Создание сотрудника
router.post('/', async (req, res) => {
    const { last_name, first_name, patronymic, birth_date, passport_data, address, organization_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO staff (last_name, first_name, patronymic, birth_date, passport_data, address, organization_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [last_name, first_name, patronymic, birth_date, passport_data, address, organization_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Чтение всех сотрудников
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM staff WHERE deleted_at IS NULL');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Обновление сотрудника
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { last_name, first_name, patronymic, birth_date, passport_data, address, organization_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE staff SET last_name = $1, first_name = $2, patronymic = $3, birth_date = $4, passport_data = $5, address = $6, organization_id = $7 WHERE id = $8 RETURNING *',
            [last_name, first_name, patronymic, birth_date, passport_data, address, organization_id, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Мягкое удаление сотрудника
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE staff SET deleted_at = NOW() WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;