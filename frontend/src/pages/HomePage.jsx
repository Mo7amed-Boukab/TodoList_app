import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/layout/Header';
import KanbanBoard from '../components/kanban/KanbanBoard';
import Button from '../components/common/Button';
import AddTaskModal from '../components/modals/AddTaskModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import TaskDetailsModal from '../components/modals/TaskDetailsModal';
import { Search, Plus, Loader } from 'lucide-react';
import todoService from '../services/todoService';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Details Modal State
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            const response = await todoService.getAllTodos();
            if (response.success && Array.isArray(response.data)) {
                setTodos(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTodos();
        } else {
            setTodos([]);
        }
    }, [user]);

    const handleTaskCreated = (newTodo) => {
        setTodos((prev) => [...prev, newTodo]);
    };

    const handleTaskUpdated = (updatedTodo) => {
        setTodos((prev) => prev.map(t => t._id === updatedTodo._id ? updatedTodo : t));
    };

    const handleDeleteRequest = (task) => {
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;

        try {
            setDeleteLoading(true);
            const response = await todoService.deleteTodo(taskToDelete._id);
            if (response.success) {
                setTodos((prev) => prev.filter(t => t._id !== taskToDelete._id));
                setIsDeleteModalOpen(false);
                setTaskToDelete(null);
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsDetailsModalOpen(true);
    };

    const handleTaskDetailsUpdated = (updatedTask) => {
        setTodos((prev) => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        setSelectedTask(updatedTask); // Update selected task to reflect changes in modal
    };

    const filteredTodos = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-[1600px] mx-auto px-20 py-8">
                {/* Search & Actions Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded leading-5 bg-white placeholder-gray-400 focus:outline-none sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Add Task Button */}
                    {user && (
                        <Button
                            variant="primary"
                            className="w-full md:w-auto shadow-lg shadow-gray-100"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Add Task
                        </Button>
                    )}
                </div>

                {/* The Board */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <KanbanBoard
                        todos={filteredTodos}
                        onTaskUpdated={handleTaskUpdated}
                        onTaskDeleted={handleDeleteRequest}
                        onTaskClick={handleTaskClick}
                    />
                )}
            </main>

            {/* Modals */}
            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTaskCreated={handleTaskCreated}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                taskTitle={taskToDelete?.title}
                loading={deleteLoading}
            />

            <TaskDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                task={selectedTask}
                onTaskUpdated={handleTaskDetailsUpdated}
            />
        </div>
    );
};

export default HomePage;
