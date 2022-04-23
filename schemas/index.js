const mongoose = require("mongoose");

const connect = () => {
    mongoose
      .connect(
        "mongodb://localhost:27017/마피아",
        // 이후 배포 시 변경 필요.
        { ignoreUndefined: true }
      )
      .catch((err) => {
        console.error(err);
      });
  };
  
  module.exports = connect;