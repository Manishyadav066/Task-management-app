import { useState, useRef, useEffect } from 'react';

export default function Chatbot({ data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your Project Assistant. Ask me about your tasks!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const processQuery = (query) => {
        const q = query.toLowerCase();
        let response = "I'm not sure about that. Try asking for a 'summary' or 'how many tasks'.";

        if (q.includes('hello') || q.includes('hi')) {
            response = "Hello there! Ready to help you manage your tasks.";
        } else if (q.includes('how are you')) {
            response = "I'm just a bot, but I'm functioning perfectly! How can I help you?";
        } else if (q.includes('summary') || q.includes('status')) {
            const totalTasks = Object.keys(data.tasks).length;
            const columns = data.columnOrder.map(colId => {
                const col = data.columns[colId];
                return `${col.title}: ${col.taskIds.length}`;
            }).join(', ');
            response = `Project Summary: You have ${totalTasks} total tasks. Breakdown: ${columns}.`;
        } else if (q.includes('count') || q.includes('how many')) {
            const totalTasks = Object.keys(data.tasks).length;
            response = `There are currently ${totalTasks} tasks on the board.`;
        } else if (q.includes('high priority') || q.includes('urgent')) {
            const highTasks = Object.values(data.tasks).filter(t => t.priority === 'High');
            if (highTasks.length > 0) {
                response = `You have ${highTasks.length} high priority tasks: ${highTasks.map(t => t.content).join(', ')}.`;
            } else {
                response = "Great news! You have no high priority tasks right now.";
            }
        } else if (q.includes('suggest') || q.includes('idea')) {
            const suggestions = ["Review code", "Update documentation", "Team sync", "Fix bugs", "Refactor CSS"];
            const random = suggestions[Math.floor(Math.random() * suggestions.length)];
            response = `How about adding a task to: ${random}?`;
        }

        return response;
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate thinking delay
        setTimeout(() => {
            const aiResponse = processQuery(input);
            setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
        }, 600);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '1rem'
        }}>
            {isOpen && (
                <div
                    className="glass"
                    style={{
                        width: '350px',
                        height: '450px',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'slideIn 0.3s ease-out',
                        border: '1px solid var(--border)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '10px',
                                height: '10px',
                                background: '#10b981',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #10b981'
                            }} />
                            <span style={{ fontWeight: 600 }}>AI Assistant</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem'
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '0.8rem 1rem',
                                borderRadius: '12px',
                                background: msg.sender === 'user' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                                color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                                fontSize: '0.9rem',
                                lineHeight: '1.4',
                                borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                                borderBottomLeftRadius: msg.sender === 'ai' ? '2px' : '12px'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '1rem',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            style={{
                                padding: '0.8rem 1.2rem',
                                borderRadius: '8px',
                                background: 'var(--accent)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px var(--accent-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.1) rotate(5deg)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1) rotate(0deg)'}
            >
                {isOpen ? '×' : '🤖'}
            </button>

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
