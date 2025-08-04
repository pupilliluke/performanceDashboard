const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'todos.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    category TEXT DEFAULT 'general',
    due_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    parent_id TEXT,
    order_index INTEGER DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES todos(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#0078d4',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`INSERT OR IGNORE INTO categories (id, name, color) VALUES 
    ('work', 'Work', '#d13438'),
    ('personal', 'Personal', '#0078d4'),
    ('health', 'Health', '#107c10'),
    ('finance', 'Finance', '#8764b8')`);
});

const getAllTodos = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM todos ORDER BY created_at DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getTodoById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const createTodo = (todo) => {
  return new Promise((resolve, reject) => {
    const { id, title, description, priority, status, category, due_date, parent_id, order_index } = todo;
    db.run(
      `INSERT INTO todos (id, title, description, priority, status, category, due_date, parent_id, order_index) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description, priority, status, category, due_date, parent_id, order_index],
      function(err) {
        if (err) reject(err);
        else resolve({ id, ...todo });
      }
    );
  });
};

const updateTodo = (id, updates) => {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    db.run(
      `UPDATE todos SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values,
      function(err) {
        if (err) reject(err);
        else {
          // Return full todo object after update
          db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        }
      }
    );
  });
};

const deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve({ deleted: this.changes > 0 });
    });
  });
};

const getTodosByDateRange = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM todos 
       WHERE due_date BETWEEN ? AND ? 
       ORDER BY due_date ASC`,
      [startDate, endDate],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const getTodoStats = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        status,
        priority,
        category,
        COUNT(*) as count,
        DATE(created_at) as date
      FROM todos 
      GROUP BY status, priority, category, DATE(created_at)
      ORDER BY date DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getCategories = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  db,
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosByDateRange,
  getTodoStats,
  getCategories
};