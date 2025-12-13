import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await authService.getCurrentUser();
                    if (response.success) {
                        setUser(response.data);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = async (email, password) => {
        const response = await authService.login({ email, password });
        if (response.success) {
            setUser(response.data);
        }
        return response;
    };

    const register = async (username, email, password) => {
        const response = await authService.register({ username, email, password });
        if (response.success) {
            setUser(response.data);
        }
        return response;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
