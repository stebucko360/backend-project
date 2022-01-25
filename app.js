const express = require("express");
const cors = require("cors");
const apiRouter = require("./routers/api.router");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors
} = require("./errors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
