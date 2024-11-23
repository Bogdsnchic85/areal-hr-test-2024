const express = require('express'); 
const router = express.Router(); 
const pool = require('../db'); 

// Создание записи в истории изменений
router.post('/', async (req, res) => { 
    const { who_changed_it, operation_object, changed_fields } = req.body; 
    try { 
        const result = await pool.query( 
            'INSERT INTO history_of_changes (who_changed_it, operation_object, changed_fields) VALUES ($1, $2, $3) RETURNING *', 
            [who_changed_it, operation_object, changed_fields] 
        ); 
        res.status(201).json(result.rows[0]); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ error: 'Database error' }); 
    } 
}); 

// Чтение всех записей истории изменений
router.get('/', async (req, res) => { 
    try { 
        const result = await pool.query('SELECT * FROM history_of_changes'); 
        res.json(result.rows); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ error: 'Database error' }); 
    } 
}); 

// Обновление записи в истории изменений
router.put('/:id', async (req, res) => { 
    const { id } = req.params; 
    const { who_changed_it, operation_object, changed_fields } = req.body; 
    try { 
        const result = await pool.query( 
            'UPDATE history_of_changes SET who_changed_it = $1, operation_object = $2, changed_fields = $3 WHERE id = $4 RETURNING *', 
            [who_changed_it, operation_object, changed_fields, id] 
        ); 
        res.json(result.rows[0]); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ error: 'Database error' }); 
    } 
}); 

// Удаление записи из истории изменений
router.delete('/:id', async (req, res) => { 
    const { id } = req.params; 
    try { 
        await pool.query('DELETE FROM history_of_changes WHERE id = $1', [id]); 
        res.status(204).send(); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ error: 'Database error' }); 
    } 
}); 

module.exports = router;
