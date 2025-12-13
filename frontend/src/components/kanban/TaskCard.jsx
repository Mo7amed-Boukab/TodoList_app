import { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Trash2, MoreVertical, CheckCircle, Clock, Circle } from 'lucide-react';
import todoService from '../../services/todoService';


const TaskCard = ({ task, onUpdate, onDelete, isMenuOpen, onToggleMenu, onClick }) => {
    const [loading, setLoading] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    useEffect(() => {
        if (isMenuOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.right + window.scrollX - 144,
            });
        }
    }, [isMenuOpen]);

    const calculateDaysRemaining = (dueDate) => {
        if (!dueDate) return 0;
        const diffTime = new Date(dueDate) - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(task);
        onToggleMenu(null);
    };

    const handleStatusChange = async (newStatus) => {
        try {
            setLoading(true);
            const response = await todoService.updateTodo(task._id, { status: newStatus });
            if (response.success) {
                onUpdate(response.data);
            }
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setLoading(false);
            onToggleMenu(null);
        }
    };

    const daysRemaining = calculateDaysRemaining(task.dueDate);

    return (
        <Card onDoubleClick={onClick} className="flex flex-col gap-4 hover:shadow-lg hover:shadow-gray-200 transition-shadow cursor-pointer group relative">
            {/* Header: Title & Priority */}
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{task.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={task.priority} />

                    {/* Actions Menu */}
                    <div className="relative">
                        <button
                            ref={buttonRef}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleMenu(task._id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {isMenuOpen && (
                            <div
                                className="fixed bg-white shadow-xl border border-gray-100 rounded z-50 py-1 w-36 animate-in fade-in zoom-in-95 duration-100"
                                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-50">Move to</div>
                                <button
                                    onClick={() => handleStatusChange('todo')}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${task.status === 'todo' ? 'text-gray-900' : 'text-gray-600'}`}
                                >
                                    <Circle size={14} /> To Do
                                </button>
                                <button
                                    onClick={() => handleStatusChange('in_progress')}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${task.status === 'in_progress' ? 'text-blue-700' : 'text-gray-600'}`}
                                >
                                    <Clock size={14} /> In Progress
                                </button>
                                <button
                                    onClick={() => handleStatusChange('done')}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${task.status === 'done' ? 'text-emerald-600' : 'text-gray-600'}`}
                                >
                                    <CheckCircle size={14} /> Done
                                </button>
                                <div className="border-t border-gray-50 my-1"></div>
                                <button
                                    onClick={handleDelete}
                                    className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Date / Label */}
            <div className="text-xs font-medium text-gray-500">
                {task.status === 'done' ? (
                    <span className="text-emerald-600">Completed: {formatDate(task.updatedAt)}</span>
                ) : (
                    <span className={task.priority === 'high' || daysRemaining < 0 ? 'text-red-700' : 'text-gray-700'}>
                        {daysRemaining > 0
                            ? `${daysRemaining} Days Remaining`
                            : daysRemaining === 0
                                ? 'Due Today'
                                : `${Math.abs(daysRemaining)} Days Overdue`}
                    </span>
                )}
            </div>

            {/* Separator line */}
            <div className="h-px bg-gray-100 w-full border-t border-dashed border-gray-200" />

            {/* Description */}
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed pb-2">
                {task.description}
            </p>

            {loading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                </div>
            )}
        </Card>
    );
};

export default TaskCard;
