const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const ApiError = require("../utility/ApiError");
const asyncHandler = require("../utility/asyncHandler");
const ApiResponse = require("../utility/ApiResponse");
const { ChatMessage } = require("../models/message.model");
const { emitMessage } = require("../socket/Socket");
const { default: mongoose } = require("mongoose");
const ChatEventEnum = require("../socket/constants");
//create he Chat model
// create chat aggregation

const chatAggregation = () => {
  return [
    {
      $lookup: {
        from: "user",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              // refreshToken: 0,
              // forgotPasswordToken: 0,
              // forgotPasswordExpiry: 0,
              // emailVerificationToken: 0,
              // emailVerificationExpiry: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "chatmessages",
        foreignField: "_id",
        localField: "lastMessage",
        as: "lastMessage",
        pipeline: [
          {
            $lookup: {
              from: "Users",
              foreignField: "_id",
              localField: "sender",
              as: "sender",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatar: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];
};

const OnetoOneChat = asyncHandler(async (req, res) => {
  const { receiverID } = req.params;

  if (!receiverID) {
    throw new ApiError(401, false, "user Id not found");
  }
  const receiver = await User.findById(receiverID);
  if (!receiver) {
    throw new ApiError(401, false, "User not found");
  }
  if (receiver._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, false, "You can not chat with your self");
  }
  // new chat
  const chat = Chat.aggregate([
    {
      $match: {
        $and: [
          { participants: { $elemMatch: { $eq: req.user._id } } },
          {
            participants: {
              $elemMatch: { $eq: new mongoose.Types.ObjectId(receiverID) },
            },
          },
        ],
      },
    },
    ...chatAggregation(),
  ]);
  if (chat.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Chat retrieved successfully", chat[0]));
  }
  //create new chat
  const newChatMessage = await Chat.create({
    name: "one to one chat",
    participants: [req.user._id, new mongoose.Types.ObjectId(receiverID)],
  });

  const result = Chat.aggregate([
    {
      $match: {
        _id: newChatMessage._id,
      },
    },
    ...chatAggregation(),
  ]);

  const payload = result[0];

  if (!payload) {
    throw new ApiError(500, "Internal server error");
  }

  payload?.participants?.forEach((participants) => {
    if (participants._id.toString() === req.user._id.toString()) return; // don't emit the event for the logged in use as he is the one who is initiating the chat
    emitMessage(
      req,
      participants._id?.toString(),
      ChatEventEnum.NEW_CHAT_EVENT,
      chat
    );
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Chat retrieved successfully", payload));
});

module.exports = { OnetoOneChat };
