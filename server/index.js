require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const DB = require("./src/DB/DBconnection");
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");

//files imports
const Register = require("./src/routes/Register.routes");
const UserLogin=require("./src/routes/Login.routes")
const io = new Server(server, {
  connectionStateRecovery: {},
});

const user = {};
app.use(express.json());
// io.on("connection", (socket) => {
//   // console.log("connection establish:", socket.id);

//   socket.on("room code", (code) => {
//     socket.join(code);
//     console.log("user has joined the room");
//   });

//   socket.on("user-name", (name) => {
//     user[socket.id] = name;
//   });
//   socket.on("message", (msg, code) => {
//     console.log(msg);

//     socket
//       .to(code)
//       .emit("message", { username: user[socket.id], message: msg });
//   });
//   socket.on("leave room", (code) => {
//     socket.leave(code);
//   });
// });
// app.get("/", (req, res) => {
//   return res.sendFile("../server/src/public/index.html");
// });
/*Routes */
app.use("/api/v1/register", Register);
app.use("/api/v1/login", UserLogin);

const startServer = () => {
  server.listen(process.env.PORT || 3000, () => {
    console.log("server is online:", process.env.PORT || 3000);
  });
};

DB()
  .then(() => {
    startServer();
  })
  .catch(error => console.log(error));
