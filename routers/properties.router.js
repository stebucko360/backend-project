const express = require("express");
const {
  postNewProperty,
  getProperties
} = require("../controllers/properties.controller");

const propertiesRouter = express.Router();

propertiesRouter
  .route("/")
  .post(postNewProperty)
  .get(getProperties);

module.exports = propertiesRouter;
