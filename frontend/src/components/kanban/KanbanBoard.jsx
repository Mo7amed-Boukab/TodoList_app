import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = ({ todos = [], onTaskUpdated, onTaskDeleted, onTaskClick }) => {
    // Distribute tasks to columns
    const columns = {
        todo: { title: 'To Do', count: todos.filter(t => t.status === 'todo').length },
        in_progress: { title: 'In Progress', count: todos.filter(t => t.status === 'in_progress').length },
        done: { title: 'Completed', count: todos.filter(t => t.status === 'done').length }
    };

    const getTasksByStatus = (status) => todos.filter(task => task.status === status);

    const [activeMenuId, setActiveMenuId] = useState(null);

    const handleToggleMenu = (taskId) => {
        setActiveMenuId(prevId => prevId === taskId ? null : taskId);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {Object.keys(columns).map((status) => (
                <KanbanColumn
                    key={status}
                    columnId={status}
                    columnDef={columns[status]}
                    tasks={getTasksByStatus(status)}
                    onTaskUpdated={onTaskUpdated}
                    onTaskDeleted={onTaskDeleted}
                    activeMenuId={activeMenuId}
                    onToggleMenu={handleToggleMenu}
                    onTaskClick={onTaskClick}
                />
            ))}
        </div>
    );
};

export default KanbanBoard;
