const { body } = require("express-validator");
const validatorMeddleware = require("../../middlewares/validatorMeddleware");

const createTodoValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string"),

  body("status")
    .optional()
    .isIn(["pending", "done"])
    .withMessage("Status must be either 'pending' or 'done'"),

  validatorMeddleware,
];

module.exports = createTodoValidator;