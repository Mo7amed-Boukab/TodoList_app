const express = require('express');
const router = express.Router();

const createTodoValidator = require('../utils/validators/createTodoValidator');
const updateTodoValidator = require('../utils/validators/updateTodoValidator');
const reorderTodosValidator = require('../utils/validators/reorderTodosValidator');

const TodoController = require('../controllers/todoController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Protect all routes

// Statistics endpoint (must be before /:id to avoid conflict)
router.get('/stats', TodoController.getTodoStats);

// Kanban board endpoint
router.get('/kanban', TodoController.getTodosKanban);

// Reorder todos (drag & drop)
router.put('/reorder', reorderTodosValidator, TodoController.reorderTodos);

// CRUD operations
router.post('/', createTodoValidator, TodoController.createTodo);
router.get('/', TodoController.getAllTodos);
router.get('/:id', TodoController.getTodoById);
router.put('/:id', updateTodoValidator, TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;
