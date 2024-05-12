const express = require("express");
const { uploads } = require("../middleware/multer.js");
const {
  getAllMessage,
  sendMessage,
} = require("../controllers/Message.controller");
const verifyJWT = require("../middleware/verifyJWT.middlewares");
const router = express.Router();
router.use(verifyJWT);

router
  .route("/:chatId")
  .get(getAllMessage)
  .post(uploads.fields([{ name: "attachments", maxCount: 5 }]), sendMessage);

module.exports = router;
