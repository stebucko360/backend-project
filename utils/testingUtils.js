const db = require("../db/connection");

exports.checkIfUserExists = (user_id) => {
  return db.query("SELECT * FROM users WHERE  user_id = $1", [user_id])
    .then((response) => {
      if (response.rows.length < 1) {
        return Promise.reject({ status: 400, msg: "user_id does not exist" });
      }
    });
};