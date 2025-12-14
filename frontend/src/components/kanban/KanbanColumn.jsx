import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Circle, Loader2, CheckCircle2 } from 'lucide-react';

const icons = {
    todo: <Circle size={20} className="text-gray-900" />,
    in_progress: <Loader2 size={20} className="text-gray-900" />,
    done: <CheckCircle2 size={20} className="text-gray-900" />
}

const KanbanColumn = ({ columnId, columnDef, tasks, onTaskUpdated, onTaskDeleted, activeMenuId, onToggleMenu, onTaskClick }) => {
    const { setNodeRef } = useDroppable({
        id: columnId,
    });

    return (
        <div className="flex flex-col h-full w-full min-w-[280px] md:min-w-[320px] bg-slate-50/50 rounded p-4 border border-slate-100/50">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2">
                    {icons[columnId] || icons.todo}
                    <h2 className="text-base md:text-lg font-bold text-gray-900">{columnDef.title}</h2>
                </div>
                <span className="bg-white px-3 py-1 rounded text-xs md:text-sm font-bold border border-gray-100 text-gray-700">
                    {columnDef.count}
                </span>
            </div>

            {/* Tasks List */}
            <div ref={setNodeRef} className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar flex-1 min-h-[100px]">
                <SortableContext
                    items={tasks.map(t => t._id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map(task => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onUpdate={onTaskUpdated}
                            onDelete={onTaskDeleted}
                            isMenuOpen={activeMenuId === task._id}
                            onToggleMenu={onToggleMenu}
                            onClick={() => onTaskClick(task)}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

export default KanbanColumn;
