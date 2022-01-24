const express = require("express");
const propertiesRouter = require("./properties.router");
const usersRouter = require("./users.router");

const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/properties", propertiesRouter);

module.exports = apiRouter;
