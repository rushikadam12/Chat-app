const express = require("express");
const verifyJWT = require("../middleware/verifyJWT.middlewares");
const {
  getAllChat,
  OnetoOneChat,
  searchAvailableUsers,
  createGroupChat,
  getGroupChatDetails,
  deleteGroupChat,
  addParticipantInGroup,
  removePeronFromGroup,
  leaveGroupChat,
  deleteOneOnOneChat,
} = require("../controllers/Chat.controller");
const router = express.Router();

router.use(verifyJWT);
router.route("/").get(getAllChat);
router.route("/c/:receiverID").post(OnetoOneChat);
router.route("/users").get(searchAvailableUsers);

router.route("/groupChat").post(createGroupChat);

router
  .route("/group/:chatId")
  .post(getGroupChatDetails)
  .delete(deleteGroupChat);

router
  .route("/group/:chatId/:participantId")
  .post(addParticipantInGroup)
  .delete(removePeronFromGroup);
router.route("/leave/group/:chatId").delete(leaveGroupChat);

router.route("/removeMessage/:chatId").delete(deleteOneOnOneChat);
router.route("/");

module.exports = router;
