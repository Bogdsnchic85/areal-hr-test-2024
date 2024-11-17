const express = require('express'); 
const router = express.Router(); 
const pool = require('../db'); 

// Создание операции HR
router.post('/', async (req, res) => { 
    const { staff_id, operation_type, department_id, position_id, salary } = req.body; 
    try { 
        const result = await pool.query( 
            'INSERT INTO hr_operations (staff_id, operation_type, department_id, position_id, salary) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [staff_id, operation_type, department_id, position_id, salary] 
        ); 
        res.status(201).json(result.rows[0]); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ error: 'Database error' }); 
    } 
}); 

// Чтение всех операций HR
router.get('/', async (req, res) => { 
    try { 
        const result = await pool.query('SELECT * FROM hr_operations');  
        res.json(result.rows);  
    } catch (error) {  
        console.error(error);  
        res.status(500).json({ error: 'Database error' });  
    }  
}); 

// Обновление операции HR
router.put('/:id', async (req, res) => {  
    const { id } = req.params;  
    const { staff_id, operation_type, department_id, position_id, salary } = req.body;  
    try {  
        const result = await pool.query(  
            'UPDATE hr_operations SET staff_id = $1, operation_type = $2, department_id = $3, position_id = $4, salary = $5 WHERE id = $6 RETURNING *',  
            [staff_id, operation_type, department_id, position_id, salary, id]  
        );  
        res.json(result.rows[0]);  
    } catch (error) {  
        console.error(error);  
        res.status(500).json({ error: 'Database error' });  
    }  
}); 

// Удаление операции HR
router.delete('/:id', async (req, res) => {  
    const { id } = req.params;  
    try {  
        await pool.query('DELETE FROM hr_operations WHERE id = $1', [id]);  
        res.status(204).send();  
    } catch (error) {  
        console.error(error);  
        res.status(500).json({ error: 'Database error' });  
    }  
}); 

module.exports = router;
