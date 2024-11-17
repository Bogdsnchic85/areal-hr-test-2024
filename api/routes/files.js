const express = require('express'); 
const router = express.Router(); 
const pool = require('../db'); 

// Создание файла 
router.post('/', async (req, res) => { 
    const { name, file, staff_id } = req.body; 
    try { 
        const result = await pool.query( 
            'INSERT INTO files (name, file, staff_id) VALUES ($1, $2, $3) RETURNING *', 
            [name, file, staff_id] 
        ); 
        res.status(201).json(result.rows[0]); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ error: 'Database error' }); 
    } 
}); 

// Чтение всех файлов 
router.get('/', async (req, res) => { 
    try { 
        const result = await pool.query('SELECT * FROM files'); 
        res.json(result.rows); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ error: 'Database error' }); 
    } 
}); 

// Обновление файла 
router.put('/:id', async (req, res) => { 
    const { id } = req.params; 
    const { name, file, staff_id } = req.body; 
    try { 
        const result = await pool.query( 
            'UPDATE files SET name = $1, file = $2, staff_id = $3 WHERE id = $4 RETURNING *', 
            [name, file, staff_id, id] 
        ); 
        res.json(result.rows[0]); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ error: 'Database error' }); 
    } 
}); 

// Удаление файла 
router.delete('/:id', async (req, res) => { 
    const { id } = req.params; 
    try { 
        await pool.query('DELETE FROM files WHERE id = $1', [id]); 
        res.status(204).send(); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ error: 'Database error' }); 
    } 
}); 

module.exports = router;
