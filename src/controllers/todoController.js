const mongoose = require("mongoose");
const Todo = require("../models/todoModel");
const logger = require("../utils/logger");

class TodoController {
  async createTodo(req, res) {
    try {
      const { title, description, status } = req.body;

      const newTodo = await Todo.create({ title, description, status });
 
      logger.info(`Todo created: ${newTodo._id}`);
      return res.status(201).json({
        success: true,
        message: "Todo created successfully",
        data: newTodo,
      });
    } catch (err) {
      logger.error(`CreateTodo Error: ${err.message}`);  
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  async getAllTodos(req, res) {
    try {
      const todos = await Todo.find();

      logger.info(`Retrieved ${todos.length} todos`);
      return res.status(200).json({
        success: true,
        message: "All Todos retrieved successfully",
        data: todos,
      });
    } catch (err) {
      logger.error(`getAllTodos Error: ${err.message}`);   
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  async getTodoById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid ID format: ${id}`);
        return res.status(400).json({
          success: false,
          message: "Invalid ID format",
        });
      }
      
      const todo = await Todo.findById(id);

      if (!todo) {
        logger.warn(`No Todo found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: `No Todo found with ID ${id}`,
        });
      }

      logger.info(`Todo fetched: ${id}`);
      return res.status(200).json({
        success: true,
        message: "Todo found successfully",
        data: todo,
      });
    } catch (err) {
      logger.error(`getTodoById Error: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  async updateTodo(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid ID for update: ${id}`);
        return res.status(400).json({
          success: false,
          message: "Invalid ID format",
        });
      }

      const { title, description, status } = req.body;

      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { title, description, status },
        { new: true, runValidators: true }
      );

      if (!updatedTodo) {
        logger.warn(`Update failed, Todo not found: ${id}`);
        return res.status(404).json({
          success: false,
          message: `No Todo found with ID ${id}`,
        });
      }

      logger.info(`Todo updated: ${id}`);
      return res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        data: updatedTodo,
      });
    } catch (err) {
      logger.error(`updateTodo Error: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  async deleteTodo(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid ID for delete: ${id}`);
        return res.status(400).json({
          success: false,
          message: "Invalid ID format",
        });
      }

      const deletedTodo = await Todo.findByIdAndDelete(id);

      if (!deletedTodo) {
        logger.warn(`Delete failed, Todo not found: ${id}`);
        return res.status(404).json({
          success: false,
          message: `No Todo found with ID ${id}`,
        });
      }

      logger.info(`Todo deleted: ${id}`);
      return res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
        data: deletedTodo,
      });
    } catch (err) {
      logger.error(`deleteTodo Error: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
}

module.exports = new TodoController();