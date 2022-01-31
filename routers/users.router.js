const express = require("express");
const {
  getUserByID,
  postNewUser,
  patchLikedHouses,
  getLikedProperties,
  getUserChats,
  deleteLikedProperty,
} = require("../controllers/users.controller.js");

const usersRouter = express.Router();

usersRouter.route("/:user_id").get(getUserByID);
usersRouter.route("/").post(postNewUser);
usersRouter
  .route("/:user_id/likedhouses")
  .patch(patchLikedHouses)
  .get(getLikedProperties)
  .delete(deleteLikedProperty);

usersRouter.route("/:user_id/chats").get(getUserChats);
module.exports = usersRouter;
