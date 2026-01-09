import { io } from 'socket.io-client';

// Connect to backend (adjust port if needed)
export const socket = io('http://localhost:3001');
