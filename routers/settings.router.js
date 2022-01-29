const express = require("express");
const {
    patchSettingsPostcode
} = require("../controllers/settings.controller");

const settingsRouter = express.Router();

settingsRouter.route("/:user_id")
    .patch(patchSettingsPostcode);


module.exports = settingsRouter;
