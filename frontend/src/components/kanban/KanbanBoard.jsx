import KanbanColumn from './KanbanColumn';
import { mockTasks, columns } from '../../data/mockData';

const KanbanBoard = () => {
    // Distribute tasks to columns
    const getTasksByStatus = (status) => mockTasks.filter(task => task.status === status);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {Object.entries(columns).map(([id, colDef]) => (
                <KanbanColumn
                    key={id}
                    columnId={id}
                    columnDef={colDef}
                    tasks={getTasksByStatus(id)}
                />
            ))}
        </div>
    );
};

export default KanbanBoard;
