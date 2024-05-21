require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const DB = require("./src/DB/DBconnection");
const path = require("path");
const server = http.createServer(app);
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const passport = require("./src/controllers/Passport.controller");
const session = require("express-session");
const cors = require("cors");

//files imports
const Register = require("./src/routes/Register.routes");
const UserLogin = require("./src/routes/Login.routes");
const passportLogin = require("./src/routes/passport.routes");
const socketInitialization = require("./src/socket/Socket");
const chatRouter = require("./src/routes/chat.routes");
const messageRouter = require("./src/routes/message.routes");
const errorHandler = require("./src/middleware/errorHandler");

const io = new Server(server, {
  connectionStateRecovery: {},
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(
  session({
    secret: "asdwsfdawfqw",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set("io", io);

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
app.use("/api/v1/passport", passportLogin);
app.use("/api/v1/chat-app/chats", chatRouter);
app.use("/api/v1/chat-app/messages", messageRouter);

io.on("connect", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
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
  .catch((error) => console.log(error));
app.use(errorHandler);
