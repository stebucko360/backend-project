const db = require("../db/connection");
const { checkIfUserExists } = require('../utils/testingUtils')
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

exports.addLikedHouse = (user_id, house) => {

  return db.query(
    `UPDATE users SET liked_houses = liked_houses || $1::jsonb WHERE user_id = $2 RETURNING *;`,
    [house, user_id]
    ).then((result) => {
        return result.rows[0];
  });
};

// GET /api/users/:user_id/likedhouses

exports.fetchLikedProperties = (user_id) => {
 /*  if (typeof +user_id !== "number" || isNaN(+user_id)) {
    return Promise.reject({ status: 400, msg: "user_id does not exist" });
  } */

/*   return db
    .query(`SELECT * FROM users WHERE user_id = $1;`, [user_id]) */
   /*  .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user_id does not exist" });
      }
    }) */
  /*   .then(() => { */
      return db.query(`SELECT liked_houses FROM users WHERE user_id = $1;`, [
        user_id,
      ]).then((result) => {
      return result.rows;
    });
};

// DELETE /api/users/:user_id/likedhouses

exports.removeLikedProperty = (user_id, property_id) => {
  return db
    .query(
      `UPDATE users SET liked_houses = array_remove(liked_houses, $1) WHERE user_id = $2;`,
      [property_id, user_id]
    )
    .then((result) => {
      return result;
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
