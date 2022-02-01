const express = require("express");
const { patchSettings } = require("../controllers/settings.controller");

const settingsRouter = express.Router();

settingsRouter.route("/:user_id").patch(patchSettings);

module.exports = settingsRouter;
