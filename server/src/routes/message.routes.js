const express = require("express");
const {
  getAllMessage,
  sendMessage,
} = require("../controllers/Message.controller");
const verifyJWT = require("../middleware/verifyJWT.middlewares");
const router = express.Router();
router.use(verifyJWT)

router.route("/:chatId").get(getAllMessage).post(sendMessage);

module.exports=router