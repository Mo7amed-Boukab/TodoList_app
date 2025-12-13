import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="flex items-center justify-between px-20 py-8 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
                <Link to="/">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">To Do List</h1>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User size={18} className="text-gray-400" />
                            <span>Bienvenue, {user.username}</span>
                        </div>
                        <Button
                            variant="ghost"
                            className="text-gray-500 hover:text-red-700 font-medium flex items-center gap-2"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <Button variant="ghost" className="text-gray-600 font-semibold">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" className="rounded px-6 shadow-lg shadow-gray-100">Register</Button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
