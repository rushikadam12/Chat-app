const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "user_image/");
  },
  filename: function (req, file, cb) {
    let filExtension = "";
    if (file.originalname.split(".").length > 1) {
      filExtension = file.originalname.substring(
        file.originalname.indexOf(".")
      );
    }

    const filenameWithoutExtension = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-")
      ?.split(".")[0];

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, filenameWithoutExtension + uniqueSuffix + filExtension);
  },
});

const uploads = multer({
  storage: storage,
  limits: { fileSize: 4 * 1000 * 1000 },
});
module.exports = { uploads };
