import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/layout/Header';
import KanbanBoard from '../components/kanban/KanbanBoard';
import Button from '../components/common/Button';
import FilterButton from '../components/common/FilterButton';
import AddTaskModal from '../components/modals/AddTaskModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import TaskDetailsModal from '../components/modals/TaskDetailsModal';
import { Search, Plus, Loader, Filter, ListFilter } from 'lucide-react';
import todoService from '../services/todoService';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

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

    const handleTasksReordered = (reorderedTodos) => {
        setTodos((prev) => {
            const newTodos = [...prev];
            reorderedTodos.forEach(updatedTodo => {
                const index = newTodos.findIndex(t => t._id === updatedTodo.id);
                if (index !== -1) {
                    newTodos[index] = { ...newTodos[index], ...updatedTodo };
                }
            });
            return newTodos;
        });
    };

    const filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
        const matchesStatus = filterStatus === 'all' || todo.status === filterStatus;

        return matchesSearch && matchesPriority && matchesStatus;
    });

    const priorityOptions = [
        { value: 'all', label: 'All Priorities' },
        { value: 'high', label: 'High Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'low', label: 'Low Priority' }
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'todo', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'done', label: 'Completed' }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-20 py-8">
                {/* Search & Actions Bar */}
                {/* Search & Actions Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">

                    {/* Search & Filters Group */}
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto flex-1">
                        {/* Search Bar */}
                        <div className="relative w-full md:max-w-full lg:max-w-xl">
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

                        {/* Filters */}
                        <div className="hidden lg:flex gap-3 w-full md:w-auto">
                            <FilterButton
                                options={statusOptions}
                                value={filterStatus}
                                onChange={setFilterStatus}
                            // icon={ListFilter}
                            />

                            <FilterButton
                                options={priorityOptions}
                                value={filterPriority}
                                onChange={setFilterPriority}
                            // icon={Filter}
                            />
                        </div>
                    </div>

                    {/* Add Task Button */}
                    {user && (
                        <Button
                            variant="primary"
                            className="w-full md:w-auto shadow-lg shadow-gray-100 flex-shrink-0 text-sm md:text-base"
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
                        onTasksReordered={handleTasksReordered}
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
