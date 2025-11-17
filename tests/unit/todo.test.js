const TodoController = require('../../src/controllers/TodoController');
const Todo = require('../../src/models/todoModel');
const mongoose = require('mongoose');

// Mock des dépendances
jest.mock('../../src/models/todoModel');

describe('Unit Tests - TodoList', () => {
  let req, res, next;
  const validObjectId = new mongoose.Types.ObjectId().toString(); 

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });


  describe('TodoController - createTodo', () => {
    test('doit créer un todo avec succès', async () => {
      const mockTodo = {
        _id: '123',
        title: 'Test Todo',
        description: 'Test Description',
        status: 'pending',
      };

      req.body = { title: 'Test Todo', description: 'Test Description' };
      Todo.create.mockResolvedValue(mockTodo);

      await TodoController.createTodo(req, res);

      expect(Todo.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Todo created successfully',
        data: mockTodo,
      });
    });
  });

  describe('TodoController - getAllTodos', () => {
    test('doit récupérer tous les todos', async () => {
      const mockTodos = [
        { _id: '1', title: 'Todo 1' , description: 'Desc 1'},
        { _id: '2', title: 'Todo 2' , description: 'Desc 2'},
      ];

      Todo.find.mockResolvedValue(mockTodos);


      await TodoController.getAllTodos(req, res);

      expect(Todo.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'All Todos retrieved successfully',
        data: mockTodos,
      });
    });
  });

  describe('TodoController -getTodoById', () => {
    test('doit récupérer un todo par ID', async () => {
      const mockTodo = { _id: validObjectId, title: 'Test Todo' , description: 'Test Description'};
      req.params.id = validObjectId;
      Todo.findById.mockResolvedValue(mockTodo);

      await TodoController.getTodoById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Todo found successfully',
        data: mockTodo,
      });
    });

    test('doit retourner 404 si todo non trouvé', async () => {
      req.params.id = validObjectId;
      Todo.findById.mockResolvedValue(null);

      await TodoController.getTodoById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('TodoController - updateTodo', () => {
    test('doit mettre à jour un todo', async () => {
      const mockTodo = { _id: validObjectId, title: 'Updated Todo', description: 'Updated Description' };
      req.params.id = validObjectId;
      req.body = { title: 'Updated Todo', description: 'Updated Description' };
      Todo.findByIdAndUpdate.mockResolvedValue(mockTodo);

      await TodoController.updateTodo(req, res);

      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(validObjectId, req.body, {
        new: true,
        runValidators: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('doit retourner 404 si todo non trouvé', async () => {
      req.params.id = validObjectId;
      req.body = { title: 'Updated' , description: 'Updated Description' };
      Todo.findByIdAndUpdate.mockResolvedValue(null);

      await TodoController.updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('No Todo found'),
      });

    });

  });

  describe('TodoController - deleteTodo', () => {
    test('doit supprimer un todo', async () => {
      const mockTodo = { _id: validObjectId, title: 'Deleted Todo', description: 'Deleted Description' };
      req.params.id = validObjectId;
      Todo.findByIdAndDelete.mockResolvedValue(mockTodo);

      await TodoController.deleteTodo(req, res);

      expect(Todo.findByIdAndDelete).toHaveBeenCalledWith(validObjectId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Todo deleted successfully',
        data: mockTodo,
      });
    });

    test('doit retourner 404 si todo à supprimer non trouvé', async () => {
      req.params.id = validObjectId;
      Todo.findByIdAndDelete.mockResolvedValue(null);

      await TodoController.deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});