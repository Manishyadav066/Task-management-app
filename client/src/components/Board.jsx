import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

export default function Board({ column, tasks, addTask, deleteTask, updateTask, deleteColumn }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskContent, setNewTaskContent] = useState('');

    const handleAddTask = () => {
        if (!newTaskContent.trim()) return;
        addTask(column.id, newTaskContent);
        setNewTaskContent('');
        setIsAdding(false);
    };
    return (
        <div className="glass" style={{
            width: '320px',
            minWidth: '320px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 150px)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{column.title}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                    }}>
                        {tasks.length}
                    </span>
                    <button
                        onClick={() => deleteColumn(column.id)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Delete List"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                            flexGrow: 1,
                            transition: 'background-color 0.2s ease',
                            background: snapshot.isDraggingOver ? 'rgba(255,255,255,0.02)' : 'transparent',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            minHeight: '100px'
                        }}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                index={index}
                                columnId={column.id}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            />
                        ))}
                        {provided.placeholder}

                        {isAdding ? (
                            <div className="add-task-form" style={{ marginTop: '0.5rem' }}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Enter task title..."
                                    value={newTaskContent}
                                    onChange={(e) => setNewTaskContent(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddTask();
                                        if (e.key === 'Escape') setIsAdding(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border)',
                                        background: 'var(--bg-primary)',
                                        color: 'var(--text-primary)',
                                        marginBottom: '0.5rem'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={handleAddTask}
                                        style={{
                                            padding: '4px 8px',
                                            background: 'var(--primary)',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: 'white',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setIsAdding(false)}
                                        style={{
                                            padding: '4px 8px',
                                            background: 'transparent',
                                            border: '1px solid var(--border)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAdding(true)}
                                style={{
                                    width: '100%',
                                    marginTop: '0.5rem',
                                    padding: '0.5rem',
                                    background: 'transparent',
                                    border: '1px dashed var(--border)',
                                    borderRadius: '8px',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.05)';
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.color = 'var(--primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.borderColor = 'var(--border)';
                                    e.target.style.color = 'var(--text-secondary)';
                                }}
                            >
                                <span>+ Add Task</span>
                            </button>
                        )}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
