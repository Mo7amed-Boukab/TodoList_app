import Card from '../common/Card';
import Badge from '../common/Badge';

const TaskCard = ({ task }) => {
    return (
        <Card className="flex flex-col gap-4 hover:shadow-lg hover:shadow-gray-200 transition-shadow cursor-pointer group">
            {/* Header: Title & Priority */}
            <div className="flex justify-between items-start">
                <h3 className="text-base font-bold text-gray-900 leading-tight">{task.title}</h3>
                <Badge variant={task.priority} />
            </div>

            {/* Date / Label */}
            <div className="text-xs font-medium text-gray-500">
                {task.status === 'done' ? (
                    <span className="text-emerald-600">Completed: {task.completedDate}</span>
                ) : (
                    <span className={task.priority === 'high' ? 'text-red-700' : 'text-gray-700'}>
                        {task.daysRemaining} Days Remaining
                    </span>
                )}
            </div>

            {/* Separator line */}
            <div className="h-px bg-gray-100 w-full border-t border-dashed border-gray-200" />

            {/* Description */}
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed pb-2">
                {task.description}
            </p>

        </Card>
    );
};

export default TaskCard;
