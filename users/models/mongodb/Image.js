const mongoose = require("mongoose");
const { URL, CONFIG256 } = require("../../helpers/MongooseValidators");

const Image = new mongoose.Schema({
  url: URL,
  alt: CONFIG256,
});

module.exports = Image;
