const mongoose = require("mongoose");
const { CONFIG256 } = require("../../helpers/mongooseValidators");

const Address = new mongoose.Schema({
  state: {
    type: String,
    minLength: 2,
    maxLength: 256,
    trim: true,
    lowercase: true,
    default: "not defined",
  },
  country: CONFIG256,
  city: CONFIG256,
  street: CONFIG256,
  houseNumber: {
    type: Number,
    required: true,
    trim: true,
    minLength: 1,
  },
  zip: {
    type: Number,
    trim: true,
    minLength: 4,
    default: 0,
  },
});

module.exports = Address;
