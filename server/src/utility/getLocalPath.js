const fs = require("fs");
const getLocalPath = (req, fileName) => {
  return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};
const getStaticPath = (filename) => {
  return `user_images/${filename}`;
};

module.exports = { getLocalPath, getStaticPath };
