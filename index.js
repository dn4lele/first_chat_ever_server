const express = require("express");
const http = require("http");
const socket = require("socket.io");

const PORT = 3000;

const app = express();
const server = http.createServer(app);

const io = socket(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("connect", () => {
    console.log("User connected", socket.id);
  });

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
  });

  socket.on("disconnect", (data) => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
