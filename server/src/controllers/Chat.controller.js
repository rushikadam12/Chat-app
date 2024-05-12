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
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            },
          },
        ],
      },
    },
    {
      // lookup for the group chats
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
                    username: 1,
                    avatar: 1,
                    email: 1,
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
    },
    {
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
        participants: { $elemMatch: { $eq: req.user?._id } },
      },
    },
    {
      $sort: { updateAt: -1 },
    },

    ...chatAggregation(),
  ]);
  console.log("result:" + result);
  return res
    .status(200)
    .json(
      new ApiResponse(200, "User chat fetched successfully", result || [], true)
    );
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { name, participants } = req.body;
  console.log(req.user._id);
  if (participants.includes(req.user._id.toString())) {
    throw new ApiError(400, false, "Participants should not contain himself");
  }
  const members = [...new Set([...participants, req.user._id.toString()])]; //to remove duplicate participant
  if (members.length < 3) {
    throw new ApiError(404, false, "Minimum three participants is required");
  }

  const groupChat = await Chat.create({
    name,
    isGroupChat: true,
    participants: members,
    admin: req.user._id.toString(),
  });

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: groupChat._id,
      },
    },
    ...chatAggregation(),
  ]);
  console.log(chat);
  // return res.send({ ans: "........" });
  const payLoad = chat[0];
  if (!payLoad) {
    throw new ApiError(500, "Internal serve Error");
  }

  payLoad?.participants?.forEach((participant) => {
    if (participants.toString() === req.user._id.toString()) {
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

const deleteOneOnOneChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.aggregate({
    $match: {
      _id: new mongoose.Types.ObjectId(chatId),
      isGroupChat: true,
      ...chatAggregation(),
    },
  });
  const payload = chat[0];
  if (!payload) {
    throw new ApiError(404, "Chat does not exits");
  }

  await Chat.findByIdAndDelete(chatId); //delete chat even if user is not admin because it's personal chat
  await deleteCascadeChatMessage(chatId); //delete attachments

  const otherParticipant = payload?.participants?.find((participant) => {
    participant?._id.toString() !== req.user._id.toString();
  });

  emitMessage(
    req,
    otherParticipant._id?.toString(),
    ChatEventEnum.LEAVE_CHAT_EVENT,
    payload
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "chat deleted successfully", {}, true));
});

const leaveGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const chat = await Chat.aggregate({
    $match: { _id: new mongoose.Types.ObjectId(chatId) },
    isGroupChat: true,
  });

  if (!chat) {
    throw new ApiError(404, false, "Group chat doesn't exits");
  }
  const existingUser = chat?.participant;
  if (!existingUser?.includes(req.user._id)) {
    //to check if user is part of group or not
    throw new ApiError(404, false, "You are not part of this group");
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        participants: req.user?._id, //leave the group
      },
    },
    { new: true }
  );

  const upChat = await Chat.aggregate(
    {
      $match: {
        _id: updatedChat._id,
        isGroupChat: true,
      },
    },
    ...chatAggregation()
  );
  const payLoad = upChat[0];
  if (!payLoad) {
    throw new ApiError(500, false, "Internal server error");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Left the group successFully", payLoad, true));
});

const addParticipantInGroup = asyncHandler(async (req, res) => {
  const { chatId, participantId } = req.params;
  const chat = await Chat.findOne({
    $match: { _id: new mongoose.Types.ObjectId(chatId), isGroupChat: true },
  });
  if (!chat) {
    //if chat present or not
    throw new ApiError(404, false, "chat not exits");
  }
  if (chat.admin?.toString() !== req.user?._id.toString()) {
    //check the admin
    throw new ApiError(404, false, "Your are not the admin of the group");
  }

  const existingParticipant = chat.participants;

  if (existingParticipant?.includes(participantId)) {
    throw new ApiError(404, false, "Participant already exist");
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        participants: participantId,
      },
    },
    { new: true }
  );
  const upChat = await Chat.aggregate(
    {
      $match: {
        _id: updatedChat._id,
      },
    },
    ...chatAggregation()
  );
  const payload = upChat[0];
  if (!payload) {
    throw new ApiError(500, "Internal server error");
  }
  emitMessage(req, participantId, ChatEventEnum.NEW_CHAT_EVENT, payload);
  return res
    .status(200)
    .json(new ApiResponse(200, "added participant in chat", payload, true));
});

const removePeronFromGroup = asyncHandler(async (req, res) => {
  const { chatId, participantId } = req.params;
  const groupChat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(chatId),
    isGroupChat: true,
  });
  if (!groupChat) {
    throw new ApiError(404, false, "Group Chat doesn't exist");
  }
  if (groupChat.admin?._id.toString() !== req.user._id.toString()) {
    throw new ApiError(404, false, "You are not admin of this group");
  }

  const existingParticipant = groupChat.participants;

  if (!existingParticipant?.includes(participantId)) {
    throw new ApiError(404, false, "participant not present in group chat");
  }

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        _id: participantId,
      },
    },
    { new: true }
  );
  const upChat = await Chat.aggregate([
    {
      $match: {
        _id: updateChat._id,
      },
    },
    ...chatAggregation(),
  ]);
  const payload = upChat[0];
  if (!payload) {
    throw new ApiError(500, false, "Internal server error");
  }
  emitMessage(req, participantId, ChatEventEnum.LEAVE_CHAT_EVENT, payload);
  return res
    .status(200)
    .json(new ApiResponse(200, "Person removed from group", payload, true));
});

module.exports = {
  OnetoOneChat,
  getAllChat,
  createGroupChat,
  searchAvailableUsers,
  getGroupChatDetails,
  deleteGroupChat,
  deleteOneOnOneChat,
  leaveGroupChat,
  addParticipantInGroup,
  removePeronFromGroup,
};
