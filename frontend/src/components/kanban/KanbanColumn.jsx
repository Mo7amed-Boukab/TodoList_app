import TaskCard from './TaskCard';
import { Circle, Loader2, CheckCircle2 } from 'lucide-react';

const icons = {
    todo: <Circle size={20} className="text-gray-900" />,
    in_progress: <Loader2 size={20} className="text-gray-900" />,
    done: <CheckCircle2 size={20} className="text-gray-900" />
}

const KanbanColumn = ({ columnId, columnDef, tasks, onTaskUpdated, onTaskDeleted, activeMenuId, onToggleMenu, onTaskClick }) => {
    return (
        <div className="flex flex-col h-full min-w-[320px] bg-slate-50/50 rounded p-4 border border-slate-100/50">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2">
                    {icons[columnId] || icons.todo}
                    <h2 className="text-lg font-bold text-gray-900">{columnDef.title}</h2>
                </div>
                <span className="bg-white px-3 py-1 rounded text-sm font-bold border border-gray-100 text-gray-700">
                    {columnDef.count}
                </span>
            </div>

            {/* Tasks List */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
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
            </div>
        </div>
    );
};

export default KanbanColumn;
