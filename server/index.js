const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosByDateRange,
  getTodoStats,
  getCategories
} = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/todos', async (req, res) => {
  try {
    const todos = await getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await getTodoById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const todoData = {
      id: uuidv4(),
      ...req.body
    };
    const todo = await createTodo(todoData);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.status === 'completed' && !updates.completed_at) {
      updates.completed_at = new Date().toISOString();
    }
    const todo = await updateTodo(req.params.id, updates);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const result = await deleteTodo(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/todos/range/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const todos = await getTodosByDateRange(startDate, endDate);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getTodoStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});