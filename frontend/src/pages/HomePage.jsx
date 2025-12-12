import React, { useState } from 'react';
import Header from '../components/layout/Header';
import KanbanBoard from '../components/kanban/KanbanBoard';
import Button from '../components/common/Button';
import AddTaskModal from '../components/modals/AddTaskModal';
import { Search, Plus } from 'lucide-react';

const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                        />
                    </div>

                    {/* Add Task Button */}
                    <Button
                        variant="primary"
                        className="w-full md:w-auto shadow-lg shadow-gray-100"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Add Task
                    </Button>
                </div>

                {/* The Board */}
                <KanbanBoard />
            </main>

            {/* Modals */}
            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default HomePage;
