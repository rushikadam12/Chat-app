const file = require("fs");


const removeLocalFile = (path) => {
  file.unlinkSync(`${path}`, (err) => {
    if (err) {
      console.log("Error while removing file");
    } else {
      console.log("file removed successfully");
    }
  });
};

module.exports=removeLocalFile