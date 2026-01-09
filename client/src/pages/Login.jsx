import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    async function handleGoogleLogin() {
        try {
            setError('');
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        }
    }

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)'
        }}>
            <div className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h1 className="heading" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>TaskFlow</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage your team's tasks in real-time.</p>

                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

                <button onClick={handleGoogleLogin} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    Login with Google
                </button>
            </div>
        </div>
    );
}
