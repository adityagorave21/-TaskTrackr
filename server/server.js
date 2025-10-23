const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'pass123',
    database: process.env.DB_NAME || 'tasktracker_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });
    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// -------------------- Auth Routes --------------------

app.post('/api/auth/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) return res.status(400).json({ message: 'User already exists' });
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, role || 'user'],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    });
});

// -------------------- Projects Routes --------------------

app.get('/api/projects', verifyToken, (req, res) => {
    const query = `
        SELECT p.*, u.username AS owner_name, 
            COUNT(DISTINCT t.id) AS total_tasks,
            COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) AS completed_tasks
        FROM projects p 
        LEFT JOIN users u ON p.owner_id = u.id
        LEFT JOIN tasks t ON p.id = t.project_id
        WHERE p.owner_id = ? OR p.id IN (SELECT DISTINCT project_id FROM tasks WHERE assigned_to = ?)
        GROUP BY p.id
        ORDER BY p.created_at DESC
    `;
    db.query(query, [req.userId, req.userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/projects', verifyToken, (req, res) => {
    const { name, description, status } = req.body;
    db.query(
        'INSERT INTO projects (name, description, owner_id, status) VALUES (?, ?, ?, ?)',
        [name, description, req.userId, status || 'active'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Project created', projectId: result.insertId });
        }
    );
});

app.put('/api/projects/:id', verifyToken, (req, res) => {
    const { name, description, status, progress } = req.body;
    db.query(
        'UPDATE projects SET name = ?, description = ?, status = ?, progress = ? WHERE id = ? AND owner_id = ?',
        [name, description, status, progress, req.params.id, req.userId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Project not found' });
            res.json({ message: 'Project updated' });
        }
    );
});

app.delete('/api/projects/:id', verifyToken, (req, res) => {
    db.query(
        'DELETE FROM projects WHERE id = ? AND owner_id = ?',
        [req.params.id, req.userId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Project not found' });
            res.json({ message: 'Project deleted' });
        }
    );
});

// -------------------- Tasks Routes --------------------

app.get('/api/projects/:projectId/tasks', verifyToken, (req, res) => {
    const query = `
        SELECT t.*, u.username AS assigned_to_name 
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id 
        WHERE t.project_id = ? 
        ORDER BY t.created_at DESC
    `;
    db.query(query, [req.params.projectId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/tasks', verifyToken, (req, res) => {
    const { project_id, title, description, assigned_to, status, priority, deadline } = req.body;
    db.query(
        'INSERT INTO tasks (project_id, title, description, assigned_to, status, priority, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [project_id, title, description, assigned_to, status || 'pending', priority || 'medium', deadline],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Task created', taskId: result.insertId });
        }
    );
});

app.put('/api/tasks/:id', verifyToken, (req, res) => {
    const { title, description, status, priority, deadline, assigned_to } = req.body;
    db.query(
        'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, deadline = ?, assigned_to = ? WHERE id = ?',
        [title, description, status, priority, deadline, assigned_to, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
            res.json({ message: 'Task updated' });
        }
    );
});

app.delete('/api/tasks/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Task deleted' });
    });
});

// -------------------- Comments Routes --------------------

app.get('/api/tasks/:taskId/comments', verifyToken, (req, res) => {
    const query = `
        SELECT c.*, u.username 
        FROM comments c 
        JOIN users u ON c.user_id = u.id
        WHERE c.task_id = ? 
        ORDER BY c.created_at DESC
    `;
    db.query(query, [req.params.taskId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/comments', verifyToken, (req, res) => {
    const { task_id, comment } = req.body;
    db.query(
        'INSERT INTO comments (task_id, user_id, comment) VALUES (?, ?, ?)',
        [task_id, req.userId, comment],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Comment added', commentId: result.insertId });
        }
    );
});

// -------------------- Analytics Routes --------------------

app.get('/api/analytics/dashboard', verifyToken, (req, res) => {
    const queries = {
        totalProjects: 'SELECT COUNT(*) as count FROM projects WHERE owner_id = ?',
        totalTasks: 'SELECT COUNT(*) as count FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE owner_id = ?)',
        completedTasks: 'SELECT COUNT(*) as count FROM tasks WHERE status = "completed" AND project_id IN (SELECT id FROM projects WHERE owner_id = ?)',
        pendingTasks: 'SELECT COUNT(*) as count FROM tasks WHERE status = "pending" AND project_id IN (SELECT id FROM projects WHERE owner_id = ?)'
    };
    const stats = {};
    let completed = 0;
    Object.keys(queries).forEach((key) => {
        db.query(queries[key], [req.userId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            stats[key] = results[0].count;
            completed++;
            if (completed === Object.keys(queries).length) {
                res.json(stats);
            }
        });
    });
});

// -------------------- Users Routes --------------------

app.get('/api/users', verifyToken, (req, res) => {
    db.query('SELECT id, username, email FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// -------------------- Start Server --------------------

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
