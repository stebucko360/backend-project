const { fetchUserByID, addNewUser } = require("../models/users.model");

exports.getUserByID = (req, res, next) => {
  const { user_id } = req.params;

  fetchUserByID(user_id).then((result) => {
    res.status(200).send({ user: result });
  });
};

exports.postNewUser = (req, res, next) => {
  const {
    user_id,
    username,
    password,
    first_name,
    last_name,
    email,
    profile_pic,
  } = req.body;

  addNewUser(
    user_id,
    username,
    password,
    first_name,
    last_name,
    email,
    profile_pic
  ).then((result) => {
    res.status(201).send({ user: result });
  });
};
