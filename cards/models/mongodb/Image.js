const mongoose = require("mongoose");
const { URL, CONFIG256 } = require("../../helpers/mongooseValidators");

const Image = new mongoose.Schema({
  url: URL,
  alt: CONFIG256,
});

module.exports = Image;
