const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  gameNo: {
      type: Number,
      unique : true,
  },  
  player: []
});

module.exports = mongoose.model("Game", gameSchema);