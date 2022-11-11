const morgan = require("morgan");
const chalk = require("chalk");
const currentDate = require("../../utils/dateService");
const fileLogger = require("./fileLogger");

const logger = morgan((tokens, req, res) => {
  const { year, month, day, hours, minutes, seconds } = currentDate();
  const dateConvert = `[${year}/${month}/${day} ${hours}:${minutes}:${seconds}]`;
  const status = +tokens.status(req, res);
  if (status >= 400) {
    return chalk.redBright(
      [
        `${dateConvert}`,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        "-",
        tokens["response-time"](req, res),
        "ms",
      ].join(" ")
    );
  }
  return chalk.cyanBright(
    [
      `${dateConvert}`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ")
  );
});

module.exports = logger;
