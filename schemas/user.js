const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique : true
  },
  userPw: {
    type: String,
  },
  userNick: {
    type: String
  },
  userWin : {
    type : Number
  },
  userLose : {
    type : Number
  },
  from:{
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);