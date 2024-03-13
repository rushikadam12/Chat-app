require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const DB = require("./src/DB/DBconnection");
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  connectionStateRecovery: {},
});

const user = {};
app.use(express.static(path.resolve("../server/src/public")));

io.on("connection", (socket) => {
  // console.log("connection establish:", socket.id);

  socket.on("room code", (code) => {
    socket.join(code);
    console.log("user has joined the room");
  });

  socket.on("user-name", (name) => {
    user[socket.id] = name;
  });
  socket.on("message", (msg, code) => {
    console.log(msg);

    socket
      .to(code)
      .emit("message", { username: user[socket.id], message: msg });
  });
  socket.on("leave room", (code) => {
    socket.leave(code);
  });
});
app.get("/", (req, res) => {
  return res.sendFile("../server/src/public/index.html");
});

const startServer = () => {
  server.listen(process.env.PORT || 3000, () => {
    console.log("server is online:", process.env.PORT || 3000);
  });
};

DB()
  .then(() => {
    startServer();
  })
  .catch((error) => [console.log(error)]);
