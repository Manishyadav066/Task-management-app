import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

export default function TaskCard({ task, index, columnId, deleteTask, updateTask }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(task.content);

    const handleUpdate = () => {
        if (editContent.trim() && editContent !== task.content) {
            updateTask(task.id, editContent);
        } else {
            setEditContent(task.content); // Revert if empty or unchanged
        }
        setIsEditing(false);
    };

    // Priority colors...
    const priorityColor = {
        High: 'var(--danger)',
        Medium: 'var(--warning)',
        Low: 'var(--success)'
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        userSelect: 'none',
                        padding: '1rem',
                        marginBottom: '0.8rem',
                        background: snapshot.isDragging ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.2)' : 'none',
                        ...provided.draggableProps.style,
                        transition: snapshot.isDragging ? 'none' : 'all 0.2s',
                        position: 'relative',
                        group: 'task-card' // For hover effects
                    }}
                    className="task-card"
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            color: priorityColor[task.priority],
                            background: `color-mix(in srgb, ${priorityColor[task.priority]} 15%, transparent)`,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontWeight: 600
                        }}>
                            {task.priority}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent drag or other clicks
                                deleteTask(task.id, columnId);
                            }}
                            className="delete-btn"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '0 4px',
                                fontSize: '1rem',
                                opacity: 0.5,
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={e => e.target.style.opacity = '1'}
                            onMouseLeave={e => e.target.style.opacity = '0.5'}
                            title="Delete Task"
                        >
                            ×
                        </button>
                    </div>

                    {isEditing ? (
                        <input
                            autoFocus
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onBlur={handleUpdate}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdate();
                            }}
                            style={{
                                width: '100%',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--primary)',
                                borderRadius: '4px',
                                padding: '4px',
                                color: 'var(--text-primary)',
                                font: 'inherit'
                            }}
                        />
                    ) : (
                        <p
                            onClick={() => setIsEditing(true)}
                            style={{ margin: 0, fontWeight: 500, cursor: 'text' }}
                            title="Click to edit"
                        >
                            {task.content}
                        </p>
                    )}

                    {task.tag && (
                        <div style={{ marginTop: '0.8rem', display: 'flex' }}>
                            <span style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-secondary)',
                                background: 'rgba(255,255,255,0.05)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid var(--border)'
                            }}>
                                #{task.tag}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
}
