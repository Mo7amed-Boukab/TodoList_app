import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-[500px] p-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-3xl font-bold mb-3 font-serif text-gray-900">Connexion</h1>
                    <p className="text-gray-500 text-sm">
                        Entrez vos identifiants pour accéder à votre compte
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-5">

                    {/* Email Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            placeholder="Entrez votre email"
                            className="block w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            placeholder="Entrez votre mot de passe"
                            className="block w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                        />
                    </div>

                    {/* Remember & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-gray-600">Se souvenir de moi</span>
                        </label>
                        <a href="#" className="font-small text-gray-900 hover:underline">
                            Mot de passe oublié ?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button type="submit" className="w-full bg-black text-white text-sm py-2.5 rounded font-medium hover:bg-gray-950 transition-all duration-200">
                        Se connecter
                    </button>
                </form>


                {/* Register Link */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    Vous n'avez pas de compte ?{' '}
                    <Link to="/register" className="font-medium text-sm text-gray-900 hover:underline">
                        S'inscrire
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

export default LoginPage;
