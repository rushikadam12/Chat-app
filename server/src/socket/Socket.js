require("dotenv").config();
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const ApiError = require("../utility/ApiError");
const User = require("../models/user.model");
const CONST_EVENT = require("./constants");

const socketInitialization = (io) => {
  io.on("connection", async (socket) => {
    try {
      // extracting token here from cookie in headers
      const cookies = cookie.parser(socket.handshake.headers?.cookie || "");

      let token = cookies.accessToken;

      if (!token) {
        token = socket.handshake.auth?.token;
        // If there is no access token in cookies. Check inside the handshake auth
      }
      if (!token) {
        throw new ApiError(401, false, "Unauthorized-access,token is missing");
      }
      const decode = jwt.verify(token, process.env.SEC_KEY);

      const user = await User.findById(decode?._id).select(
        "-password -username -email"
      );

      if (!user) {
        throw new ApiError(401, "Unauthorized-access,Token is Invalid");
      }

      socket.user = user;

      socket.emit(CONST_EVENT.CONNECT_EVENT);
      console.log("connection is created user_ID:", socket.user?._id);

      socket.on(CONST_EVENT.DISCONNECT_EVENT, () => {
        console.log("User has disconnected:");
        if (socket.user?._id) {
          socket.leave(socket.user?._id);
        }
      });
    } catch (error) {
      console.log(error);
      socket.emit(CONST_EVENT.SOCKET_EVENT, () => {
        console.log(error?.message || "something went wong with sockets");
      });
    }
  });
};
const emitMessage = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

module.exports = { socketInitialization, emitMessage };
