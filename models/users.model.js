const db = require("../db/connection");

exports.fetchUserByID = (user_id) => {
  return db
    .query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
    .then((result) => {
      return result.rows[0];
    });
};

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

exports.addLikedHouse = (user_id, property_id) => {
  return db
    .query(
      `UPDATE users SET liked_houses = array_append(liked_houses, $1) WHERE user_id = $2 RETURNING *;`,
      [property_id, user_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.fetchLikedProperties = (user_id) => {
  return db
    .query(`SELECT liked_houses FROM users WHERE user_id = $1;`, [user_id])
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
