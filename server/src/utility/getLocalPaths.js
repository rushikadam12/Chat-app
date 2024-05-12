
const getLocalPath = (req, fileName) => {
  return `${req.protocol}://${req.headers}/user_image/${fileName}`;
};
const getStaticPath = (filename) => {
  return `user_image/${filename}`;
};

module.exports = { getLocalPath, getStaticPath };
