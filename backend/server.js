const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

let onlineUsers = {};

io.on("connection", (socket) => {
  let userEmail = null;

  socket.on("login", (email) => {
    userEmail = email;
    onlineUsers[email] = socket.id;
    io.emit("online users", Object.keys(onlineUsers));
  });

  socket.on("chat message", (data) => {
    io.emit("chat message", data); // Send to all
  });

  socket.on("disconnect", () => {
    if (userEmail) {
      delete onlineUsers[userEmail];
      io.emit("online users", Object.keys(onlineUsers));
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server running...");
});

http.listen(3000, () => {
  console.log("Server running on port 3000");
});
