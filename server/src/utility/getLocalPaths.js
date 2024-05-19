const getStaticPath = (req, fileName) => {
  return `${req.protocol}://${req.get('host')}/user_image/${fileName}`;
};
const getLocalPath = (filename) => {
  return `user_image/${filename}`;
};

module.exports = { getLocalPath, getStaticPath };
