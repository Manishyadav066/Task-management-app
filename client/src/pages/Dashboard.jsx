import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import confetti from 'canvas-confetti';
import Board from '../components/Board';
import Chatbot from '../components/Chatbot';
import { socket } from '../socket';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const initialStructure = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Design System', priority: 'High', tag: 'Design' },
        'task-2': { id: 'task-2', content: 'Auth Integration', priority: 'High', tag: 'Backend' },
        'task-3': { id: 'task-3', content: 'Animation Polish', priority: 'Medium', tag: 'Frontend' },
        'task-4': { id: 'task-4', content: 'Testing', priority: 'Low', tag: 'QA' },
    },
    columns: {
        'todo': { id: 'todo', title: 'To Do', taskIds: ['task-1', 'task-2', 'task-3', 'task-4'] },
        'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: [] },
        'done': { id: 'done', title: 'Done', taskIds: [] },
    },
    columnOrder: ['todo', 'in-progress', 'done'],
};

export default function Dashboard() {
    const [data, setData] = useState(initialStructure);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Load initial data from Firestore or LocalStorage
    useEffect(() => {
        const boardRef = doc(db, 'boards', 'main-board');
        let isMounted = true;

        // Forced Safety Timeout: If Firebase hangs due to bad config, load local data after 1.5s
        const timer = setTimeout(() => {
            if (isMounted) {
                console.warn("Firebase took too long, falling back to local data...");
                const localData = localStorage.getItem('boardData');
                if (localData) {
                    setData(JSON.parse(localData));
                }
                setLoading(false);
            }
        }, 1500);

        const unsubscribe = onSnapshot(boardRef, (snapshot) => {
            clearTimeout(timer); // Firebase connected successfully
            if (snapshot.exists()) {
                setData(snapshot.data());
                localStorage.setItem('boardData', JSON.stringify(snapshot.data()));
            } else {
                setDoc(boardRef, initialStructure).catch(() => {
                    const localData = localStorage.getItem('boardData');
                    if (localData) setData(JSON.parse(localData));
                });
            }
            if (isMounted) setLoading(false);
        }, (error) => {
            clearTimeout(timer);
            console.error("Firestore Error:", error);
            const localData = localStorage.getItem('boardData');
            if (localData) setData(JSON.parse(localData));
            if (isMounted) setLoading(false);
        });

        return () => {
            isMounted = false;
            clearTimeout(timer);
            unsubscribe();
        };
    }, []);

    // Listen to socket for real-time updates from other users
    useEffect(() => {
        socket.on('task_updated', (newData) => {
            setData(newData);
        });
        return () => socket.off('task_updated');
    }, []);

    const saveBoard = async (newState) => {
        try {
            // Optimistic update
            setData(newState);
            // Local Storage Backup
            localStorage.setItem('boardData', JSON.stringify(newState));

            // In a real app, we might debounce this or handle race conditions
            socket.emit('task_update', newState);
            await setDoc(doc(db, 'boards', 'main-board'), newState);
        } catch (error) {
            console.error("Error saving board:", error);
        }
    };

    const addTask = (columnId, content) => {
        const newTaskId = `task-${Date.now()}`;
        const newTask = {
            id: newTaskId,
            content,
            priority: 'Medium', // Default priority
            tag: ['Frontend', 'Backend', 'Design', 'Bug'][Math.floor(Math.random() * 4)] // Random Tag
        };

        const newState = {
            ...data,
            tasks: {
                ...data.tasks,
                [newTaskId]: newTask
            },
            columns: {
                ...data.columns,
                [columnId]: {
                    ...data.columns[columnId],
                    taskIds: [...data.columns[columnId].taskIds, newTaskId]
                }
            }
        };

        saveBoard(newState);
    };

    const deleteTask = (taskId, columnId) => {
        const newTasks = { ...data.tasks };
        delete newTasks[taskId];

        const newColumn = {
            ...data.columns[columnId],
            taskIds: data.columns[columnId].taskIds.filter(id => id !== taskId)
        };

        const newState = {
            ...data,
            tasks: newTasks,
            columns: {
                ...data.columns,
                [columnId]: newColumn
            }
        };

        saveBoard(newState);
    };

    const updateTask = (taskId, newContent) => {
        const newState = {
            ...data,
            tasks: {
                ...data.tasks,
                [taskId]: {
                    ...data.tasks[taskId],
                    content: newContent
                }
            }
        };

        saveBoard(newState);
    };

    const addColumn = () => {
        const newColumnId = `col-${Date.now()}`;
        const newColumn = {
            id: newColumnId,
            title: `New List ${Object.keys(data.columns).length + 1}`,
            taskIds: []
        };

        const newState = {
            ...data,
            columns: {
                ...data.columns,
                [newColumnId]: newColumn
            },
            columnOrder: [...data.columnOrder, newColumnId]
        };
        saveBoard(newState);
    };

    const deleteColumn = (columnId) => {
        const newColumnOrder = data.columnOrder.filter(id => id !== columnId);
        const newColumns = { ...data.columns };
        delete newColumns[columnId];

        // Optionally delete tasks associated with this column to clean up
        const newTasks = { ...data.tasks };
        data.columns[columnId].taskIds.forEach(taskId => {
            delete newTasks[taskId];
        });

        const newState = {
            ...data,
            columns: newColumns,
            columnOrder: newColumnOrder,
            tasks: newTasks
        };
        saveBoard(newState);
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = data.columns[source.droppableId];
        const finish = data.columns[destination.droppableId];

        // Confetti Trigger!
        if (finish.id === 'done' && destination.droppableId !== 'done') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            const newState = {
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn,
                },
            };

            saveBoard(newState);
            return;
        }

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };

        const newState = {
            ...data,
            columns: {
                ...data.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        saveBoard(newState);
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading Workspace...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="heading" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Project Board</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Synced with Firebase & Socket.io</p>
                </div>

                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search tasks or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: '0.8rem 1rem 0.8rem 2.5rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            background: 'rgba(255,255,255,0.03)',
                            color: 'var(--text-primary)',
                            minWidth: '250px',
                            outline: 'none'
                        }}
                    />
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '1rem', alignItems: 'flex-start' }}>
                    {data.columnOrder.map((columnId) => {
                        const column = data.columns[columnId];
                        // Filter tasks based on content or tags
                        const tasks = column.taskIds
                            .map((taskId) => data.tasks[taskId])
                            .filter(task => {
                                if (!task) return false;
                                if (!searchQuery) return true;
                                const query = searchQuery.toLowerCase();
                                return (
                                    task.content.toLowerCase().includes(query) ||
                                    (task.tag && task.tag.toLowerCase().includes(query))
                                );
                            });

                        // Guard against missing tasks (already handled above but kept for safety in map)
                        if (column.taskIds.length > 0 && tasks.some(t => !t)) return null;

                        return (
                            <Board
                                key={column.id}
                                column={column}
                                tasks={tasks}
                                addTask={addTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                deleteColumn={deleteColumn}
                            />
                        );
                    })}
                    <button
                        onClick={addColumn}
                        style={{
                            minWidth: '320px',
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px dashed var(--border)',
                            borderRadius: '16px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            height: '100px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                            e.target.style.background = 'rgba(255,255,255,0.1)';
                            e.target.style.borderColor = 'var(--text-primary)';
                        }}
                        onMouseLeave={e => {
                            e.target.style.background = 'rgba(255,255,255,0.05)';
                            e.target.style.borderColor = 'var(--border)';
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>+</span>
                        <span>Add New List</span>
                    </button>
                </div>
            </DragDropContext>

            <Chatbot data={data} />
        </div>
    );
}
