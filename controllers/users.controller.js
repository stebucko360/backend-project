const { fetchPropertyById } = require("../models/properties.model");
const {
  fetchUserByID,
  addNewUser,
  addLikedHouse,
  fetchLikedProperties,
  fetchUserChats,
  removeLikedProperty,
} = require("../models/users.model");

// GET /api/users/:user_id

exports.getUserByID = (req, res, next) => {
  const { user_id } = req.params;

  fetchUserByID(user_id)
    .then((result) => {
      res.status(200).send({ user: result });
    })
    .catch(next);
};

// POST /api/users

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
  )
    .then((result) => {
      res.status(201).send({ user: result });
    })
    .catch(next);
};

// PATCH: /api/users/:user_id/likedhouses

exports.patchLikedHouses = (req, res, next) => {
  const { user_id } = req.params;
  const { property_id } = req.body;
  addLikedHouse(user_id, property_id)
    .then((result) => {
      res.status(200).send({ user: result });
    })
    .catch(next);
};

// GET: /api/users/:user_id/likedhouses

exports.getLikedProperties = (req, res, next) => {
  const { user_id } = req.params;
  fetchLikedProperties(user_id)
    .then((result) => {
      res.status(200).send({ properties: result });
    })
    .catch(next);
};

// DELETE: /api/users/:user_id/likedhouses

exports.deleteLikedProperty = (req, res, next) => {
  const { user_id } = req.params;
  const { property_id } = req.body;
  Promise.all([
    removeLikedProperty(user_id, property_id),
    fetchUserByID(user_id),
    fetchPropertyById(property_id),
  ])
    .then(([result]) => {
      res.status(204).send({});
    })
    .catch(next);
};

exports.getUserChats = (req, res, next) => {
  const { user_id } = req.params;
  fetchUserChats(user_id)
    .then((result) => {
      res.status(200).send({ chats: result });
    })
    .catch(next);
};
