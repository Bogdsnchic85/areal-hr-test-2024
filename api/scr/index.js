const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

const pool = require('./db');

// Настройки приложения
app.set('view engine', 'ejs'); // Устанавливаем EJS в качестве движка шаблонизации
app.set('views', path.join(__dirname, 'views')); // Указываем директорию для шаблонов

app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, '/public'))); // Для статических ресурсов
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Импорт маршрутов
const organizationsRoutes = require('./routes/organizations');
const departmentsRoutes = require('./routes/departments');
const positionsRoutes = require('./routes/positions');
const staffRoutes = require('./routes/staff');
const filesRoutes = require('./routes/files');
const hrOperationsRoutes = require('./routes/hr_operations');
const historyRoutes = require('./routes/history');

// Использование маршрутов
app.use('/api/organizations', organizationsRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/positions', positionsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/hr_operations', hrOperationsRoutes);
app.use('/api/history', historyRoutes);

// Маршруты для работы с формами
app.get('/organizations/add', (req, res) => {
    res.render('addOrganization');
});

app.get('/organizations/edit/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL', [req.params.id]);
        if (!rows.length) return res.status(404).send('Организация не найдена');
        res.render('editOrganization', { organization: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send("Произошла ошибка при получении данных");
    }
});

app.get('/organizations/delete/:id', async (req, res) => {
    try {
        await pool.query('UPDATE organizations SET deleted_at = NOW() WHERE id = $1', [req.params.id]);
        res.redirect('/organizations');
    } catch (err) {
        res.send(err.message);
    }
});

app.get('/organizations', async (req, res) => {
    const { rows: organizations } = await pool.query(
        'SELECT * from organizations where deleted_at is null'
    );
    res.render("listOrganizations", { organizations });
});

// Обработчик для корневого маршрута
app.get('/', (req, res) => {
    res.send('HR Manager API is running');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});