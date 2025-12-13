import api from './api';

const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.data) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data;
    },

    login: async (userData) => {
        const response = await api.post('/auth/login', userData);
        if (response.data.data) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export default authService;
