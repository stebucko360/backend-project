const express = require("express");
const propertiesRouter = require("./properties.router");
const usersRouter = require("./users.router");
const settingsRouter = require("./settings.router")

const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/properties", propertiesRouter);
apiRouter.use("/settings", settingsRouter);

module.exports = apiRouter;
