const db = require("../db/connection");

exports.insertNewProperty = (payLoad) => {
  const { user_id, property_type, price, postcode, beds, house_images } =
    payLoad;
  return db
    .query(
      `INSERT INTO properties
  (user_id, property_type, price, postcode, beds, house_images)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;`,
      [user_id, property_type, price, postcode, beds, house_images]
    )
    .then((result) => {
      return result.rows[0];
    });
};
