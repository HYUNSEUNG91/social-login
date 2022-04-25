const mongoose = require("mongoose");

const connect = () => {
    mongoose
      .connect(
        "mongodb://3.36.75.6/mapiaGame",
        // 이후 배포 시 변경 필요.
        { ignoreUndefined: true }
      )
      .catch((err) => {
        console.error(err);
      });
  };
  
  module.exports = connect;