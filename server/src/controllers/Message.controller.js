const Chat = require("../models/chat.model");
const { default: mongoose } = require("mongoose");
const ChatMessage = require("../models/message.model");
const { emitMessage } = require("../socket/Socket");
const ApiError = require("../utility/ApiError");
const ApiResponse = require("../utility/ApiResponse");
const asyncHandler = require("../utility/asyncHandler");
const ChatEventEnum = require("../socket/constants");
const chatMessageAggregation = () => {
  return [
    {
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
  ];
};

const getAllMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const selectedChat = await Chat.findById(chatId);
  if (!selectedChat) {
    throw new ApiError(404, "Chat doesn't exits");
  }

  if (!selectedChat.participants === req.user._id) {
    throw new ApiError(400, "User is not part of the chat");
    // Only send messages if the logged in user is a part of the chat he is requesting messages of
  }

  const message = await ChatMessage.aggregate([
    {
      $match: {
        chat: new mongoose.Types.ObjectId(chatId.toString()),
      },
    },
    ...chatMessageAggregation(),
    {
      $sort: {
        createAt: -1,
      },
    },
  ]);

  // console.log(message)

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Message fetched successfully", message || [], true)
    );
});

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;
  console.log("Content:", content);
  if (!content) {
    throw new ApiError(404, false, "Message content required");
  }
  if (!chatId) {
    throw new ApiError(404, false, "Message content required");
  }
  const selectChat = Chat.findById(chatId);
  if (!selectChat) {
    throw new ApiError(404, false, "chat is not present");
  }
  // console.log(req.files);
  const messageFiles = [];
  if (req.files && req.files?.attachments?.length > 0) {
    req.files.attachments?.map((attachments) => {
      messageFiles.push({
        url: getStaticFilePath(req, attachments.filename),
        localPath: getLocalPath(attachments.filename),
      });
    });
  }

  const message = await ChatMessage.create({
    sender: new mongoose.Types.ObjectId(req.user._id.toString()),
    content: content || "",
    attachments: messageFiles || [],
    chat: new mongoose.Types.ObjectId(chatId),
  });

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { $set: { lastMessage: message._id } },
    { new: true }
  );
  // structure the message
  const receivedMessage = await ChatMessage.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(message._id),
      },
    },
    ...chatMessageAggregation(),
  ]);

  const resultMessage = receivedMessage[0];

  if (!resultMessage) {
    throw new ApiError(500, false, "Message not found");
  }
  // logic to emit socket event about the new message created to the other participants

  chat.participants.forEach((participantsObjectId) => {
    // here the chat is the raw instance of the chat in which participants is the array of object ids of users
    if (participantsObjectId.toString() === req.user._id.toString()) return;

    emitMessage(
      req,
      participantsObjectId.toString(),
      ChatEventEnum.MESSAGE_RECEIVED_EVENT,
      receivedMessage
    );
  });
  return res
    .status(200)
    .json(new ApiResponse(201, "Message saved successfully", resultMessage));
});

module.exports = { getAllMessage, sendMessage };
