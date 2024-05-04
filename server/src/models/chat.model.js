const { Schema, default: mongoose } = require("mongoose");

const chatSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
// const User = mongoose.model("User", userModel);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
