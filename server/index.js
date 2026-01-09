const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

require('dotenv').config();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Task Management Server is Running');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for now, tighten later
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  // Specific Task Management Events
  socket.on('task_update', (data) => {
    // Broadcast to all others
    socket.broadcast.emit('task_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING on port ${PORT}`);
});
