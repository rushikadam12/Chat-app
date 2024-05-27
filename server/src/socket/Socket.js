require("dotenv").config();
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const ApiError = require("../utility/ApiError");
const User = require("../models/user.model");
const ChatEventEnum = require("./constants");
const mountJoinChatEvent = (socket) => {
  socket.on(ChatEventEnum.JOIN_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    // joining the room with the chatId will allow specific events to be fired where we don't bother about the users like typing events
    // E.g. When user types we don't want to emit that event to specific participant.
    // We want to just emit that to the chat where the typing is happening
    socket.join(chatId);
  });
  socket.emit(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (message) => {
    console.log(message);
  });
};
const socketInitialization = (io) => {
  return io.on("connection", async (socket) => {
    try {
      // extracting token here from cookie in headers
      const socketId = socket.id;
      console.log("Socket connected with ID:", socketId);

      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      console.log(cookies);
      let token = cookies?.accessToken;

      if (!token) {
        token = socket.handshake.auth?.token;
        // If there is no access token in cookies. Check inside the handshake auth
      }
      if (!token) {
        throw new ApiError(401, false, "Unauthorized-access,token is missing");
      }
      const decode = jwt.verify(token, process.env.SEC_KEY);

      const user = await User.findById(decode?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Unauthorized-access,Token is Invalid");
      }

      socket.user = user;
      socket.join(user._id.toString());
      socket.emit(ChatEventEnum.CONNECT_EVENT);
      console.log("User connected 🗼. userId:", user?._id.toString());

      mountJoinChatEvent(socket);

      socket.on("disconnect", () => {
        console.log("User has disconnected:" + socket.user?._id);
        if (socket.user?._id) {
          socket.leave(socket.user?._id);
        }
      });
    } catch (error) {
      console.log(error);
      socket.emit(ChatEventEnum.SOCKET_EVENT, () => {
        console.log(error?.message || "something went wong with sockets");
      });
    }
  });
};
const emitMessage = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

module.exports = { socketInitialization, emitMessage };
