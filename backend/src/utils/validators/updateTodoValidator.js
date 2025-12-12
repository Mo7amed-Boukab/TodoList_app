const { body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const updateTodoValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'done'])
    .withMessage("Status must be: 'todo', 'in_progress', or 'done'"),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage("Priority must be: 'low', 'medium', 'high', or 'urgent'"),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date (ISO8601 format)')
    .toDate(),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer'),

  validatorMiddleware,
];

module.exports = updateTodoValidator;
