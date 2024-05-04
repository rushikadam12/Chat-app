const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const ApiError = require("../utility/ApiError");
const asyncHandler = require("../utility/asyncHandler");
const ApiResponse = require("../utility/ApiResponse");
const removeLocalFile = require("../utility/removeLocalFile");
const { emitMessage } = require("../socket/Socket");
const { default: mongoose } = require("mongoose");
const ChatEventEnum = require("../socket/constants");
const ChatMessage = require("../models/message.model");
//create he Chat model
// create chat aggregation

const chatAggregation = () => {
  return [
    {
      // lookup for the participants present
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
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
            // get details of the sender
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "sender",
              as: "sender",
              pipeline: [
                {
                  $project: {
                    email: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              sender: { $first: "$sender" },
            },
          },
        ],
      },
      $addFields: {
        lastMessage: { $first: "$lastMessage" },
      },
    },
  ];
};

const OnetoOneChat = asyncHandler(async (req, res) => {
  const { receiverID } = req.params;
  console.log("ReciverID:", receiverID);
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
  // retrieved chat
  const chat = await Chat.aggregate([
    {
      $match: {
        $and: [
          { participants: { $elemMatch: { $eq: req.user._id } } },
          {
            participants: {
              $elemMatch: {
                $eq: new mongoose.Types.ObjectId(receiverID.toString()),
              },
            },
          },
        ],
      },
    },
    ...chatAggregation(),
  ]);
  console.log("Retrieved chat:", chat);
  if (chat.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Chat retrieved successfully", chat[0]));
  }
  //create new chat
  const newChatMessage = await Chat.create({
    name: "one to one chat",
    participants: [
      req.user._id,
      new mongoose.Types.ObjectId(receiverID.toString()),
    ],
  });
  // console.log(newChatMessage)
  const result = Chat.aggregate([
    {
      $match: {
        _id: newChatMessage._id,
      },
    },
    ...chatAggregation(),
  ]);
  console.log("result:", result);
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

const getAllChat = asyncHandler(async (req, res) => {
  const result = await Chat.aggregate([
    {
      $match: {
        participants: { $elemMatch: { $eq: req.user._id } },
      },
    },
    {
      $sort: { updateAt: -1 },
    },

    ...chatAggregation(),
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(200, "User chat fetched successfully", result || [], true)
    );
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { name, participants } = req.body;
  if (participants.includes(req.user._id.toString())) {
    throw new ApiError(400, false, "Participants should not contain himself");
  }
  const members = [...new set([...participants, req.user.Id.toString()])]; //to remove duplicate participant
  if (members.length < 3) {
    throw new ApiError(404, false, "Minimum three participants is required");
  }

  const groupChat = await Chat.create({
    name,
    isGroupChat: true,
    participants: members,
    admin: req.user._id.tosString(),
  });

  const chat = Chat.aggregate([
    {
      $match: {
        _id: message._id,
      },
    },
    ...chatAggregation(),
  ]);

  const payLoad = chat[0];
  if (!payLoad) {
    throw new ApiError(500, "Internal serve Error");
  }

  payLoad?.participants?.forEach((participant) => {
    if (participants._id.toString() === req.user._id.toString()) {
      return;
    }
    emitMessage(
      req,
      participant._id.toString(),
      ChatEventEnum.NEW_CHAT_EVENT,
      payLoad
    );
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, "THe chat group has been created", payLoad, true)
    );
});

const deleteCascadeChatMessage = async (chatId) => {
  const message = ChatMessage.find({
    chat: new mongoose.Types.ObjectId(chatId),
  });
  let attachments = [];
  attachments = attachments.concat(
    ...message.map((msg) => {
      return msg.attachments;
    })
  );
  attachments.forEach((attachment) => {
    removeLocalFile(attachment.localPath);
  });
  await ChatMessage.deleteMany({
    chat: new mongoose.Types.ObjectId(chatId),
  });
};

const searchAvailableUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        _id: {
          $ne: req.user._id,
        },
      },
    },
    {
      $project: {
        avatar: 1,
        username: 1,
        email: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, "available users", users, true));
});

const getGroupChatDetails = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const message = await Chat.aggregate({
    $match: {
      _id: new mongoose.Types.ObjectId(chatId),
      isGroupChat: true,
    },
    ...chatAggregation(),
  });
  if (!message) {
    throw new ApiError(404, false, "Did not find the chat");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "All GroupChat is fetch", message, true));
});

const deleteGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const groupChat = await Chat.aggregate({
    $match: {
      _id: new mongoose.Types.ObjectId(chatId),
      isGroupChat: true,
    },
    ...chatAggregation(),
  });

  const chat = groupChat[0];
  if (!chat) {
    throw new ApiError(400, false, "Chat is not present");
  }

  if (chat.admin?.toString() !== req.user._id.toString()) {
    throw new ApiError(404, false, "Only admin can delete chat");
  }
  await Chat.findByIdAndDelete(chatId);
  await deleteCascadeChatMessage(chatId);

  chat?.participant?.forEach((participant) => {
    if (participant._id.toString() !== req.user._id.toString()) {
      return;
    }
    emitMessage(
      req,
      participant._id?.toString(),
      ChatEventEnum.LEAVE_CHAT_EVENT,
      chat
    );
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully deleted chat", {}));
});

module.exports = {
  OnetoOneChat,
  getAllChat,
  createGroupChat,
  searchAvailableUsers,
  getGroupChatDetails,
  deleteGroupChat,
};
