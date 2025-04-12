// backend/server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const users = {};

app.use(express.static(path.join(__dirname, '../frontend')));

io.on('connection', (socket) => {
  socket.on('join', (email) => {
    users[email] = socket.id;
  });

  socket.on('send-message', ({ to, from, message }) => {
    const toSocketId = users[to];
    if (toSocketId) {
      io.to(toSocketId).emit('receive-message', { from, message });
    }
  });

  socket.on('disconnect', () => {
    for (let email in users) {
      if (users[email] === socket.id) {
        delete users[email];
        break;
      }
    }
  });
});

http.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
