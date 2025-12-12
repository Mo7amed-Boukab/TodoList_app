const mongoose = require('mongoose');
const Todo = require('../models/todoModel');
const logger = require('../utils/logger');

class TodoController {
  /**
   * Create a new todo
   * POST /api/todos
   */
  async createTodo(req, res) {
    try {
      const { title, description, status, priority, dueDate } = req.body;

      const newTodo = await Todo.create({
        title,
        description,
        status,
        priority,
        dueDate,
        user: req.user.id,
      });

      logger.info(`Todo created: ${newTodo._id}`);
      return res.status(201).json({
        success: true,
        message: 'Todo created successfully',
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

  /**
   * Get all todos with filtering, searching, and sorting
   * GET /api/todos
   * Query params:
   *  - status: filter by status (todo, in_progress, done)
   *  - priority: filter by priority (low, medium, high, urgent)
   *  - search: search in title and description
   *  - sortBy: field to sort by (createdAt, updatedAt, dueDate, priority, order)
   *  - sortOrder: asc or desc (default: asc for order, desc for dates)
   *  - dueDateFrom: filter todos with dueDate >= this date
   *  - dueDateTo: filter todos with dueDate <= this date
   *  - overdue: if 'true', filter only overdue todos
   */
  async getAllTodos(req, res) {
    try {
      const {
        status,
        priority,
        search,
        sortBy = 'order',
        sortOrder,
        dueDateFrom,
        dueDateTo,
        overdue,
      } = req.query;

      // Build filter query
      const filter = { user: req.user.id };

      // Filter by status
      if (status) {
        const statusArray = status.split(',').map((s) => s.trim());
        filter.status = { $in: statusArray };
      }

      // Filter by priority
      if (priority) {
        const priorityArray = priority.split(',').map((p) => p.trim());
        filter.priority = { $in: priorityArray };
      }

      // Filter by due date range
      if (dueDateFrom || dueDateTo) {
        filter.dueDate = {};
        if (dueDateFrom) {
          filter.dueDate.$gte = new Date(dueDateFrom);
        }
        if (dueDateTo) {
          filter.dueDate.$lte = new Date(dueDateTo);
        }
      }

      // Filter overdue todos
      if (overdue === 'true') {
        filter.dueDate = { $lt: new Date(), $ne: null };
        filter.status = { $ne: 'done' };
      }

      // Build query
      let query;

      // Full-text search
      if (search) {
        query = Todo.find({
          ...filter,
          $text: { $search: search },
        });
      } else {
        query = Todo.find(filter);
      }

      // Determine sort order
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      let sortOptions = {};

      switch (sortBy) {
        case 'priority':
          // Sort by priority needs aggregation, fallback to createdAt
          sortOptions = { createdAt: sortOrder === 'asc' ? 1 : -1 };
          break;
        case 'dueDate':
          sortOptions = { dueDate: sortOrder === 'asc' ? 1 : -1 };
          break;
        case 'createdAt':
          sortOptions = { createdAt: sortOrder === 'asc' ? 1 : -1 };
          break;
        case 'updatedAt':
          sortOptions = { updatedAt: sortOrder === 'asc' ? 1 : -1 };
          break;
        case 'title':
          sortOptions = { title: sortOrder === 'asc' ? 1 : -1 };
          break;
        case 'order':
        default:
          sortOptions = { order: sortOrder === 'desc' ? -1 : 1 };
          break;
      }

      query = query.sort(sortOptions);

      const todos = await query;

      // If sorting by priority, sort in memory
      if (sortBy === 'priority') {
        todos.sort((a, b) => {
          const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
          return sortOrder === 'asc' ? -diff : diff;
        });
      }

      logger.info(`Retrieved ${todos.length} todos`);
      return res.status(200).json({
        success: true,
        message: 'All Todos retrieved successfully',
        count: todos.length,
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

  /**
   * Get todos grouped by status (for Kanban board)
   * GET /api/todos/kanban
   */
  async getTodosKanban(req, res) {
    try {
      const { priority, search, dueDateFrom, dueDateTo } = req.query;

      // Build base filter
      const baseFilter = { user: req.user.id };

      if (priority) {
        const priorityArray = priority.split(',').map((p) => p.trim());
        baseFilter.priority = { $in: priorityArray };
      }

      if (dueDateFrom || dueDateTo) {
        baseFilter.dueDate = {};
        if (dueDateFrom) baseFilter.dueDate.$gte = new Date(dueDateFrom);
        if (dueDateTo) baseFilter.dueDate.$lte = new Date(dueDateTo);
      }

      let matchStage = { ...baseFilter };

      if (search) {
        matchStage.$text = { $search: search };
      }

      // Aggregate todos grouped by status
      const kanbanData = await Todo.aggregate([
        { $match: matchStage },
        { $sort: { order: 1 } },
        {
          $group: {
            _id: '$status',
            todos: { $push: '$$ROOT' },
            count: { $sum: 1 },
          },
        },
      ]);

      // Format response as kanban columns
      const columns = {
        todo: { status: 'todo', title: 'To Do', todos: [], count: 0 },
        in_progress: {
          status: 'in_progress',
          title: 'In Progress',
          todos: [],
          count: 0,
        },
        done: { status: 'done', title: 'Done', todos: [], count: 0 },
      };

      kanbanData.forEach((group) => {
        if (columns[group._id]) {
          columns[group._id].todos = group.todos;
          columns[group._id].count = group.count;
        }
      });

      logger.info('Kanban board data retrieved');
      return res.status(200).json({
        success: true,
        message: 'Kanban board data retrieved successfully',
        data: columns,
      });
    } catch (err) {
      logger.error(`getTodosKanban Error: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  /**
   * Get a single todo by ID
   * GET /api/todos/:id
   */
  async getTodoById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid ID format: ${id}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid ID format',
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

      // Check for user
      if (todo.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized',
        });
      }

      logger.info(`Todo fetched: ${id}`);
      return res.status(200).json({
        success: true,
        message: 'Todo found successfully',
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

  /**
   * Update a todo
   * PUT /api/todos/:id
   */
  async updateTodo(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid ID for update: ${id}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
      }

      const { title, description, status, priority, dueDate, order } = req.body;

      const todo = await Todo.findById(id);

      if (!todo) {
        logger.warn(`Update failed, Todo not found: ${id}`);
        return res.status(404).json({
          success: false,
          message: `No Todo found with ID ${id}`,
        });
      }

      // Check for user
      if (todo.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized',
        });
      }

      // Build update object (only include fields that are provided)
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (dueDate !== undefined) updateData.dueDate = dueDate;
      if (order !== undefined) updateData.order = order;

      const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      logger.info(`Todo updated: ${id}`);
      return res.status(200).json({
        success: true,
        message: 'Todo updated successfully',
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

  /**
   * Reorder todos (for drag & drop)
   * PUT /api/todos/reorder
   * Body: { todos: [{ id, order, status? }] }
   */
  async reorderTodos(req, res) {
    try {
      const { todos } = req.body;

      // Verify ownership of all todos first
      const todoIds = todos.map((t) => t.id);
      const existingTodos = await Todo.find({
        _id: { $in: todoIds },
        user: req.user.id,
      });

      if (existingTodos.length !== todoIds.length) {
        return res.status(401).json({
          success: false,
          message: 'One or more todos not found or not authorized',
        });
      }

      // Bulk update todos
      const bulkOps = todos.map((todo) => ({
        updateOne: {
          filter: { _id: todo.id, user: req.user.id },
          update: {
            $set: {
              order: todo.order,
              ...(todo.status && { status: todo.status }),
            },
          },
        },
      }));

      await Todo.bulkWrite(bulkOps);

      // Fetch updated todos
      const updatedTodos = await Todo.find({
        _id: { $in: todoIds },
      }).sort({ order: 1 });

      logger.info(`Reordered ${todos.length} todos`);
      return res.status(200).json({
        success: true,
        message: 'Todos reordered successfully',
        data: updatedTodos,
      });
    } catch (err) {
      logger.error(`reorderTodos Error: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  /**
   * Delete a todo
   * DELETE /api/todos/:id
   */
  async deleteTodo(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid ID for delete: ${id}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
      }

      const todo = await Todo.findById(id);

      if (!todo) {
        logger.warn(`Delete failed, Todo not found: ${id}`);
        return res.status(404).json({
          success: false,
          message: `No Todo found with ID ${id}`,
        });
      }

      // Check for user
      if (todo.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized',
        });
      }

      await todo.deleteOne();

      logger.info(`Todo deleted: ${id}`);
      return res.status(200).json({
        success: true,
        message: 'Todo deleted successfully',
        id: id,
      });
    } catch (err) {
      logger.error(`deleteTodo Error: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  /**
   * Get todo statistics
   * GET /api/todos/stats
   */
  async getTodoStats(req, res) {
    try {
      const stats = await Todo.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        {
          $facet: {
            byStatus: [
              { $group: { _id: '$status', count: { $sum: 1 } } },
            ],
            byPriority: [
              { $group: { _id: '$priority', count: { $sum: 1 } } },
            ],
            overdue: [
              {
                $match: {
                  dueDate: { $lt: new Date(), $ne: null },
                  status: { $ne: 'done' },
                },
              },
              { $count: 'count' },
            ],
            total: [{ $count: 'count' }],
            dueToday: [
              {
                $match: {
                  dueDate: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lt: new Date(new Date().setHours(23, 59, 59, 999)),
                  },
                  status: { $ne: 'done' },
                },
              },
              { $count: 'count' },
            ],
          },
        },
      ]);

      const result = stats[0];

      // Format response
      const formattedStats = {
        total: result.total[0]?.count || 0,
        overdue: result.overdue[0]?.count || 0,
        dueToday: result.dueToday[0]?.count || 0,
        byStatus: {
          todo: 0,
          in_progress: 0,
          done: 0,
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0,
        },
      };

      result.byStatus.forEach((s) => {
        if (formattedStats.byStatus.hasOwnProperty(s._id)) {
          formattedStats.byStatus[s._id] = s.count;
        }
      });

      result.byPriority.forEach((p) => {
        if (formattedStats.byPriority.hasOwnProperty(p._id)) {
          formattedStats.byPriority[p._id] = p.count;
        }
      });

      logger.info('Todo statistics retrieved');
      return res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: formattedStats,
      });
    } catch (err) {
      logger.error(`getTodoStats Error: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
}

module.exports = new TodoController();
