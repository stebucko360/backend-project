const db = require("../db/connection");
const geocoder = require("../utils/nodeGeocoder");

// PATCH: /api/settings/:user_id

exports.updateSettingsPostcode = async (
  settings_postcode = "M17ED",
  user_id,
  settings_min_price = 0,
  settings_max_price = 300000,
  settings_house_type = "house",
  settings_radius = 5
) => {
  const postCodeRegEx = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gi;
  if (!postCodeRegEx.test(settings_postcode)) {
    return Promise.reject({ status: 400, msg: "Invalid postcode" });
  }

  const addressDataResults = await Promise.all([
    geocoder.geocode(settings_postcode),
  ]);

  return db
    .query(
      `UPDATE users 
          SET 
            settings_postcode = $1, 
            settings_latitude = $2,
            settings_longitude = $3,
            settings_price_min = $4,
            settings_price_max = $5,
            settings_house_type = $6,
            settings_radius = $7
          WHERE user_id = $8 RETURNING *;`,
      [
        addressDataResults[0][0].zipcode,
        addressDataResults[0][0].latitude,
        addressDataResults[0][0].longitude,
        settings_min_price,
        settings_max_price,
        settings_house_type,
        settings_radius,
        user_id,
      ]
    )
    .then((response) => {
      return response.rows[0];
    });
};
