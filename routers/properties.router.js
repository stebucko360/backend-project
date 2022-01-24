const express = require("express");
const { postNewProperty } = require("../controllers/properties.controller");

const propertiesRouter = express.Router();

propertiesRouter.route("/").post(postNewProperty);

module.exports = propertiesRouter;
