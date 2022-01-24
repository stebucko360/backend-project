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
