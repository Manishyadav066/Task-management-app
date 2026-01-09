import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.warn("Firebase Login failed, falling back to Dev Mode:", error);
            // Dev Mode / Bypass
            const devUser = {
                uid: 'dev-user-123',
                displayName: 'Dev User',
                email: 'dev@example.com',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
            };
            setCurrentUser(devUser);
            // Simulate async delay
            await new Promise(r => setTimeout(r, 500));
            return devUser;
        }
    }

    function logout() {
        setCurrentUser(null); // Clear local state immediately
        return signOut(auth).catch(err => console.log("SignOut caught:", err));
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
