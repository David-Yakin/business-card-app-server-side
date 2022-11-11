const express = require("express");
const app = express();
const chalk = require("chalk");
const cors = require("./middlewares/cors");
const logger = require("./logger/loggerService");
const router = require("./router/router");
const connectToDb = require("./db/dbService");
const { handleError } = require("./utils/errorHandler");
const config = require("config");
const {
  generateInitialCards,
  generateInitialUsers,
} = require("./initialData/initialDataService");
require("./logger/loggers/fileLogger");

app.use(cors);
app.use(logger);
app.use(express.json());
app.use(express.text());
app.use(express.static("./public"));
app.use(router);

router.use((error, req, res, next) => {
  handleError(res, 500, error.message);
});

const PORT = config.get("PORT");

app.listen(PORT, () => {
  console.log(chalk.blueBright(`Listening on: http://localhost:${PORT}`));
  connectToDb();
  generateInitialCards();
  generateInitialUsers();
});
