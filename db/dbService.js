const config = require("config");

const ENVIRONMENT = config.get("NODE_ENV");

const connectToDb = () => {
  if (ENVIRONMENT === "development") require("./dataBases/connectToMongoDB");
  if (ENVIRONMENT === "production") require("./dataBases/connectToAtlas");
};

module.exports = connectToDb;
