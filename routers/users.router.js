const express = require("express");
const {
  getUserByID,
  postNewUser,
} = require("../controllers/users.controller.js");

const usersRouter = express.Router();

usersRouter.route("/:user_id").get(getUserByID);
usersRouter.route("/").post(postNewUser);

module.exports = usersRouter;
