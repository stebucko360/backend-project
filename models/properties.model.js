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

exports.fetchProperties = (min_price = 0, max_price, postcode, type) => {
  let queryValues = [min_price];
  let queryString = `SELECT * FROM properties`;
  let count = 1;
  queryString += ` WHERE price >= $1`;

  if (max_price) {
    queryString += ` AND price <= $2`;
    queryValues.push(max_price);
    count++;
  }

  if (postcode) {
    queryString += ` AND postcode LIKE `;
    if (max_price) {
      queryString += `$3`;
    } else {
      queryString += `$2`;
    }
    queryValues.push(`%${postcode}%`);
    count++;
  }

  if (type) {
    queryString += ` AND property_type = `;
    queryValues.push(type);
    if (count === 1) {
      queryString += `$2`;
    } else if (count === 2) {
      queryString += `$3`;
    } else {
      queryString += `$4`;
    }
  }
  queryString += `;`;

  return db.query(queryString, queryValues).then((result) => {
    return result.rows;
  });
};
