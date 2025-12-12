const { body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const reorderTodosValidator = [
    body('todos')
        .isArray({ min: 1 })
        .withMessage('Todos must be a non-empty array'),

    body('todos.*.id')
        .notEmpty()
        .withMessage('Each todo must have an id')
        .isMongoId()
        .withMessage('Each todo id must be a valid MongoDB ObjectId'),

    body('todos.*.order')
        .isInt({ min: 0 })
        .withMessage('Each todo must have a valid order (positive integer)'),

    body('todos.*.status')
        .optional()
        .isIn(['todo', 'in_progress', 'done'])
        .withMessage("Status must be: 'todo', 'in_progress', or 'done'"),

    validatorMiddleware,
];

module.exports = reorderTodosValidator;
