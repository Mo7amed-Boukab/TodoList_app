const express = require('express');
const router = express.Router();

const createTodoValidator = require('../utils/validators/createTodoValidator');
const updateTodoValidator = require('../utils/validators/updateTodoValidator');

const TodoController = require('../controllers/TodoController');

router.post('/', createTodoValidator, TodoController.createTodo);
router.put('/:id', updateTodoValidator, TodoController.updateTodo);
router.get('/', TodoController.getAllTodos);
router.get('/:id', TodoController.getTodoById);
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;
