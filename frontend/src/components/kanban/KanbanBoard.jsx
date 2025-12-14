import React, { useState, useEffect, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import todoService from '../../services/todoService';

const KanbanBoard = ({ todos = [], onTaskUpdated, onTaskDeleted, onTaskClick, onTasksReordered }) => {
    // Local state for optimistic updates
    const [items, setItems] = useState({});
    const [activeId, setActiveId] = useState(null);

    // Initialize/Update items from props
    useEffect(() => {
        // Group todos by status
        const newItems = {
            todo: todos.filter(t => t.status === 'todo').sort((a, b) => a.order - b.order),
            in_progress: todos.filter(t => t.status === 'in_progress').sort((a, b) => a.order - b.order),
            done: todos.filter(t => t.status === 'done').sort((a, b) => a.order - b.order)
        };
        setItems(newItems);
    }, [todos]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Avoid accidental drags for clicks
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns = useMemo(() => ({
        todo: { title: 'To Do', count: items.todo?.length || 0 },
        in_progress: { title: 'In Progress', count: items.in_progress?.length || 0 },
        done: { title: 'Completed', count: items.done?.length || 0 }
    }), [items]);

    const findContainer = (id) => {
        if (id in items) {
            return id;
        }
        return Object.keys(items).find((key) => items[key].find(item => item._id === id));
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        const { id } = active;
        const overId = over ? over.id : null;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            const activeIndex = activeItems.findIndex((item) => item._id === id);
            const overIndex = overItems.findIndex((item) => item._id === overId);

            let newIndex;
            if (overId in prev) {
                // We're over a container
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item._id !== id)
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    items[activeContainer][activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length)
                ]
            };
        });
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        const { id } = active;
        const overId = over ? over.id : null;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            (activeContainer === overContainer && activeId === overId)
        ) {
            setActiveId(null);
            return;
        }

        const activeIndex = items[activeContainer].findIndex((item) => item._id === id);
        const overIndex = items[overContainer].findIndex((item) => item._id === overId);

        let newItems;

        if (activeContainer === overContainer) {
            newItems = {
                ...items,
                [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
            };
        } else {
            newItems = {
                ...items,
                [activeContainer]: items[activeContainer].filter((item) => item._id !== id),
                [overContainer]: [
                    ...items[overContainer].slice(0, overIndex),
                    items[activeContainer][activeIndex],
                    ...items[overContainer].slice(overIndex, items[overContainer].length)
                ]
            };
        }

        setItems(newItems);
        setActiveId(null);

        // Prepare update for backend
        const updates = [];
        // Only update the affected columns
        [activeContainer, overContainer].forEach(key => {
            const columnItems = activeContainer === overContainer ? newItems[key] : newItems[key] || [];
            columnItems.forEach((item, index) => {
                // Update status and position
                let needsUpdate = false;
                if (item.status !== key) {
                    item.status = key;
                    needsUpdate = true;
                }
                if (item.position !== index) {
                    item.position = index;
                    needsUpdate = true;
                }
                // We push all items in affected columns to ensure consistent ordering
                updates.push({
                    id: item._id,
                    status: key,
                    order: index // Backend expects 'order'
                });
            });
        });

        // Call backend to save order
        try {
            // De-duplicate updates based on id, prefer last one (though logic above shouldn't produce duplicates if containers distinct or same)
            const uniqueUpdates = [...new Map(updates.map(item => [item.id, item])).values()];
            await todoService.reorderTodos(uniqueUpdates);
            // We don't need to refetch immediately if we trust our optimistic update, 
            // but normally we might want to refresh. For now keeping optimistic state.
            if (onTasksReordered) {
                onTasksReordered(uniqueUpdates);
            }
        } catch (error) {
            console.error("Failed to save reorder:", error);
            // Revert changes? For now just log error.
        }
    };


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

    // Helper to find the active item for drag overlay
    const getActiveItem = () => {
        for (const key of Object.keys(items)) {
            const found = items[key].find(i => i._id === activeId);
            if (found) return found;
        }
        return null;
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                {Object.keys(columns).map((status) => (
                    <KanbanColumn
                        key={status}
                        columnId={status}
                        columnDef={columns[status]}
                        tasks={items[status] || []}
                        onTaskUpdated={onTaskUpdated}
                        onTaskDeleted={onTaskDeleted}
                        activeMenuId={activeMenuId}
                        onToggleMenu={handleToggleMenu}
                        onTaskClick={onTaskClick}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeId ? (
                    <div className="transform rotate-3 opacity-90 cursor-grabbing">
                        <TaskCard
                            task={getActiveItem()}
                            isOverlay
                            // Dummy props for overlay
                            onUpdate={() => { }}
                            onDelete={() => { }}
                            onToggleMenu={() => { }}
                            onClick={() => { }}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default KanbanBoard;
