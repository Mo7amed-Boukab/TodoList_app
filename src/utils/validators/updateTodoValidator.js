const { body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const updateTodoValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isString()
    .withMessage('Title must be a string'),

  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),

  body('status')
    .optional()
    .isIn(['pending', 'done'])
    .withMessage("Status must be either 'pending' or 'done'"),

  validatorMiddleware,
];

module.exports = updateTodoValidator;
