import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Header = () => {
    return (
        <header className="flex items-center justify-between px-20 py-8 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
                {/* Placeholder Logo Icon if needed */}
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">To Do List</h1>
            </div>

            <div className="flex items-center gap-4">
                <Link to="/login">
                    <Button variant="ghost" className="text-gray-600 font-semibold">Login</Button>
                </Link>
                <Link to="/register">
                    <Button variant="primary" className="rounded px-6 shadow-lg shadow-gray-100">Register</Button>
                </Link>
            </div>
        </header>
    );
};

export default Header;
