const express = require("express");
const http = require("http");
const socket = require("socket.io");

const PORT = 3000;

const app = express();
const server = http.createServer(app);

const io = socket(server, { cors: { origin: "*" } });
let accounts = [];

io.on("connection", (socket) => {
  socket.on("getPeople", (nothing) => {
    console.log("getPeople", accounts);
    io.emit("getPeople", accounts);
  });

  socket.on("message", (message) => {
    io.emit("message", message);

    try {
      if (message.user != null) {
        console.log("User connected", message.user.FirstName);
        let user = message.user;
        accounts.push({ id: socket.id, user });
        io.emit("getPeople", accounts);
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("disconnect", (data) => {
    console.log("User disconnected", socket.id);

    let accountobj = accounts.find((account) => account.id == socket.id);
    let username = accountobj.user.FirstName;
    io.emit("message", {
      message: username + " has disconnected!",
      type: "disconnectuser",
    });

    accounts = accounts.filter((account) => account.id != socket.id);
    io.emit("getPeople", accounts);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
