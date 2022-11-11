const express = require("express");
const app = express();
const morganLogger = require("./loggers/morganLogger");
const config = require("config");
const fileLogger = require("./loggers/fileLogger");

const LOGGER = config.get("LOGGER") || "morgan";

if (LOGGER === "morgan") app.use(morganLogger);

module.exports = app;
