import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [terms, setTerms] = useState(false);
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!terms) {
            setError('Please accept terms and conditions');
            return;
        }

        try {
            const response = await register(username, email, password);
            if (response.success) {
                navigate('/');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-[500px] p-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-3xl font-bold mb-3 font-serif text-gray-900">Inscription</h1>
                    <p className="text-gray-500 text-sm">
                        Créez votre compte pour commencer à gérer vos tâches
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded mb-5 text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Name Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Entrez votre nom complet"
                            className="block w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            placeholder="Entrez votre email"
                            className="block w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            placeholder="Créez un mot de passe"
                            className="block w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                checked={terms}
                                onChange={(e) => setTerms(e.target.checked)}
                            />
                        </div>
                        <div className="text-sm">
                            <label htmlFor="terms" className="text-gray-500 text-sm cursor-pointer">
                                J'accepte les <a href="#" className="font-small text-gray-900 hover:underline">Conditions</a> et la <a href="#" className="font-small text-gray-900 hover:underline">Politique de confidentialité</a>
                            </label>
                        </div>
                    </div>

                    {/* Register Button */}
                    <button type="submit" className="w-full bg-black text-white text-sm py-2.5 rounded font-medium hover:bg-gray-950 transition-all duration-200">
                        S'inscrire
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/login" className="font-medium text-sm text-gray-900 hover:underline">
                        Se connecter
                    </Link>
                </div>

                {/* Home Link */}
                <div className="mt-4 text-center">
                    <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
