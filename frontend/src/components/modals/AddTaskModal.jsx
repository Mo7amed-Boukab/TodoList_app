import { useState } from 'react';
import { X, Calendar, Flag, AlignLeft, Type, Loader2 } from 'lucide-react';
import todoService from '../../services/todoService';


const AddTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await todoService.createTodo({
                title,
                description,
                priority,
                dueDate
            });

            if (response.success) {
                onTaskCreated(response.data);
                resetForm();
                onClose();
            }
        } catch (err) {
            console.error('Create task error:', err);
            setError('Failed to create task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 animate-fade-in">
            <div className="bg-white rounded w-full max-w-xl overflow-hidden transform transition-all scale-100">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h2 className="text-lg lg:text-xl font-serif font-bold text-gray-900">Nouvelle Tâche</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 mx-6 mt-4 rounded text-center">
                        {error}
                    </div>
                )}

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5">

                        {/* Title Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Titre</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Type className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Titre de la tâche"
                                    className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:outline-none"
                                    autoFocus
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Dimensions Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Priority */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Priorité</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Flag className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        className="block w-full pl-10 pr-8 py-2 text-sm border border-gray-200 rounded text-gray-900 focus:outline-none appearance-none bg-white cursor-pointer"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                    {/* Custom Chevron */}
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Date d'échéance</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded text-gray-900 focus:outline-none appearance-none bg-white cursor-pointer"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Description</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <AlignLeft className="h-4 w-4 text-gray-400" />
                                </div>
                                <textarea
                                    rows={4}
                                    placeholder="Ajouter une description..."
                                    className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:outline-none resize-none custom-scrollbar"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-900 transition-all shadow-md hover:shadow-lg active:transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Créer la tâche
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
