const {
  fetchUserByID,
  addNewUser,
  addLikedHouse,
  fetchLikedProperties
} = require("../models/users.model");

exports.getUserByID = (req, res, next) => {
  const { user_id } = req.params;

  fetchUserByID(user_id)
    .then(result => {
      res.status(200).send({ user: result });
    })
    .catch(next);
};

exports.postNewUser = (req, res, next) => {
  const {
    user_id,
    username,
    password,
    first_name,
    last_name,
    email,
    profile_pic
  } = req.body;

  addNewUser(
    user_id,
    username,
    password,
    first_name,
    last_name,
    email,
    profile_pic
  )
    .then(result => {
      res.status(201).send({ user: result });
    })
    .catch(next);
};

exports.patchLikedHouses = (req, res, next) => {
  const { user_id } = req.params;
  const { property_id } = req.body;
  addLikedHouse(user_id, property_id)
    .then(result => {
      res.status(200).send({ user: result });
    })
    .catch(next);
};

exports.getLikedProperties = (req, res, next) => {
  const { user_id } = req.params;
  fetchLikedProperties(user_id)
    .then(result => {
      res.status(200).send({ properties: result });
    })
    .catch(next);
};
