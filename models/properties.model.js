const db = require("../db/connection");
const geocoder = require("../utils/nodeGeocoder");

// POST : api/properties

exports.insertNewProperty = async (payLoad) => {
  
  const { user_id, property_type, price, postcode, beds, house_images } = payLoad;

 const addressDataResults = await Promise.all([geocoder.geocode(postcode)]); 
  
  return db
    .query(
      `INSERT INTO properties
  (user_id, property_type, price, postcode, beds, house_images, latitude, longitude)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *;`,
      [user_id, property_type, price, addressDataResults[0][0].zipcode, beds, house_images, addressDataResults[0][0].latitude, addressDataResults[0][0].longitude]
    )
    .then(result => {
      return result.rows[0];
    });
};

// GET : api/properties

exports.fetchProperties = (
  min_price = 0,
  max_price,
  postcode,
  type = "all"
) => {
  if (
    type === "all" &&
    max_price === undefined &&
    postcode === undefined &&
    min_price === 0
  ) {
    return db.query(`SELECT * FROM properties;`).then(result => {
      return result.rows;
    });
  } else {
    if (!["house", "flat", "bungalow", "studio", "all"].includes(type)) {
      return Promise.reject({ status: 404, msg: "Invalid property_type" });
    }

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

    if (type !== "all") {
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
    return db.query(queryString, queryValues).then(result => {
      return result.rows;
    });
  }
};

exports.fetchPropertyById = house_id => {
  return db
    .query(`SELECT * FROM properties WHERE house_id = $1`, [house_id])
    .then(result => {
      result.rows; //?
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "house_id doesn't exist" });
      } else {
        return result.rows[0];
      }
    });
};
