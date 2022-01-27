const db = require("../db/connection");

// GET /api/users/:user_id

exports.fetchUserByID = (user_id) => {
  return db
    .query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "user_id doesn't exist" });
      } else {
        return result.rows[0];
      }
    });
};

// POST /api/users

exports.addNewUser = (
  user_id,
  username,
  password,
  first_name,
  last_name,
  email,
  profile_pic
) => {
  return db
    .query(
      `INSERT INTO users
  (user_id, username, password, first_name, last_name, email, profile_pic)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;`,
      [user_id, username, password, first_name, last_name, email, profile_pic]
    )
    .then((result) => {
      return result.rows[0];
    });
};

// PATCH: /api/users/:user_id/likedhouses

exports.addLikedHouse = (user_id, property_id) => {
  if (!property_id) {
    return Promise.reject({ status: 400, msg: "Invalid property key/value" });
  }
  return db
    .query(
      `UPDATE users SET liked_houses = array_append(liked_houses, $1) WHERE user_id = $2 RETURNING *;`,
      [property_id, user_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user_id does not exist" });
      } else {
        return result.rows[0];
      }
    });
};

// GET /api/users/:user_id/likedhouses

exports.fetchLikedProperties = (user_id) => {
  if (typeof +user_id !== "number" || isNaN(+user_id)) {
    return Promise.reject({ status: 400, msg: "user_id does not exist" });
  }

  return db
    .query(`SELECT * FROM users WHERE user_id = $1;`, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user_id does not exist" });
      }
    })
    .then(() => {
      return db.query(`SELECT liked_houses FROM users WHERE user_id = $1;`, [
        user_id,
      ]);
    })
    .then((array) => {
      const propertyArray = array.rows[0].liked_houses;
      return db.query(`SELECT * FROM properties WHERE house_id = ANY ($1);`, [
        propertyArray,
      ]);
    })
    .then((result) => {
      return result.rows;
    });
};

exports.fetchUserChats = (user_id) => {
  if (typeof +user_id !== "number" || isNaN(+user_id)) {
    return Promise.reject({ status: 400, msg: "return invalid user_id" });
  }

  return db
    .query(`SELECT * FROM users WHERE user_id = $1;`, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user_id does not exist" });
      }
    })
    .then(() => {
      return db.query(
        `SELECT * FROM chat_room WHERE ($1) = ANY(users_in_chat);`,
        [user_id]
      );
    })
    .then((result) => {
      return result.rows;
    });
};
