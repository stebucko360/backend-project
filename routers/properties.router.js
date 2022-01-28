const express = require("express");
const {
  postNewProperty,
  getProperties,
  getPropertiesById
} = require("../controllers/properties.controller");

const propertiesRouter = express.Router();

propertiesRouter.route("/").post(postNewProperty).get(getProperties);
propertiesRouter.route("/:house_id").get(getPropertiesById);

module.exports = propertiesRouter;
