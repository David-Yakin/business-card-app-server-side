const mongoose = require("mongoose");
const { CONFIG256 } = require("../../helpers/MongooseValidators");

const Name = new mongoose.Schema({
  first: CONFIG256,
  middle: {
    type: String,
    maxLength: 256,
    trim: true,
    lowercase: true,
  },
  last: CONFIG256,
});

module.exports = Name;
