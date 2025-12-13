import api from './api';

const todoService = {
    getAllTodos: async () => {
        const response = await api.get('/todos');
        return response.data;
    },

    createTodo: async (todoData) => {
        const response = await api.post('/todos', todoData);
        return response.data;
    },

    updateTodo: async (id, todoData) => {
        const response = await api.put(`/todos/${id}`, todoData);
        return response.data;
    },

    deleteTodo: async (id) => {
        const response = await api.delete(`/todos/${id}`);
        return response.data;
    }
};

export default todoService;
