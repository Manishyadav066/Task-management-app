import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        if (isDark) {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }
    }, [isDark]);

    return (
        <nav className="glass" style={{
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '0',
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 className="heading" style={{ margin: 0 }}>TaskFlow</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => setIsDark(!isDark)}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                    }}
                    title="Toggle Dark Mode"
                >
                    {isDark ? '☀️' : '🌙'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {currentUser?.photoURL && (
                        <img src={currentUser.photoURL} alt="User" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent)' }} />
                    )}
                    <span style={{ fontWeight: 500 }}>{currentUser?.displayName}</span>
                </div>
                <button onClick={logout} style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                }}
                    onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-primary)' }}
                    onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                    Logout
                </button>
            </div>
        </nav>
    );
}
