const jwt = require("jsonwebtoken");
const config = require("config");

const key = config.get("JWT_KEY");

const generateAuthToken = ({ _id, isAdmin, isBusiness }) => {
  const token = jwt.sign({ _id, isBusiness, isAdmin }, key);
  return token;
};

const verifyToken = tokenFromClient => {
  try {
    const userData = jwt.verify(tokenFromClient, key);
    return userData;
  } catch (error) {
    return null;
  }
};

exports.generateAuthToken = generateAuthToken;
exports.verifyToken = verifyToken;
