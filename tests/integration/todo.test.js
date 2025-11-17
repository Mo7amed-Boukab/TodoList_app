const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Todo = require('../../src/models/todoModel');

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Todo.deleteMany(); // nettoyer la collection après chaque test
});

describe('Todo API Tests', () => {

  test('POST /api/todos -> doit créer un nouveau todo', async () => {

    const newTodo = { title: 'Test Todo', description: 'Description test', status: 'pending' };
    const response = await request(app).post('/api/todos').send(newTodo);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(newTodo.title);
  });

  test('GET /api/todos -> doit récupérer tous les todos', async () => {

    await Todo.create({ title: 'Todo 1' , description: 'Desc 1', status: 'pending' });
    await Todo.create({ title: 'Todo 2' , description: 'Desc 2', status: 'pending' });

    const response = await request(app).get('/api/todos');

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
  });

  test('GET /api/todos/:id -> doit récupérer un todo par ID', async () => {
    const todo = await Todo.create({ title: 'Todo 1' , description: 'Desc 1', status: 'pending' });

    const response = await request(app).get(`/api/todos/${todo._id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Todo 1');
  });

  test('PUT /api/todos/:id -> doit mettre à jour un todo', async () => {
    const todo = await Todo.create({ title: 'Todo 1', description: 'Desc 1', status: 'pending' });

    const response = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send({ title: 'Updated Todo' });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated Todo');
  });

  test('DELETE /api/todos/:id -> doit supprimer un todo', async () => {
    const todo = await Todo.create({ title: 'Todo 1', description: 'Desc 1', status: 'pending' });

    const response = await request(app).delete(`/api/todos/${todo._id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
