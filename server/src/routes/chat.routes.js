const express = require("express");
const verifyJWT = require("../middleware/verifyJWT.middlewares");
const { getAllChat, OnetoOneChat } = require("../controllers/Chat.controller");
const router = express.Router();

router.use(verifyJWT);
router.route("/").get(getAllChat);
router.route("/c/:receiverID").post(OnetoOneChat);

module.exports=router