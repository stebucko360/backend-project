const db = require("../db/connection");
const geocoder = require("../utils/nodeGeocoder");

// PATCH: /api/settings/:user_id

exports.updateSettingsPostcode = async (settings_postcode, user_id) => {

console.log(4444, settings_postcode);

  const addressDataResults = await Promise.all([geocoder.geocode(settings_postcode)]); 

  return db.query(
        `UPDATE users 
          SET 
            settings_postcode = $1, 
            settings_latitude = $2,
            settings_longitude = $3
          WHERE user_id = $4 RETURNING *;`,
        [addressDataResults[0][0].zipcode, addressDataResults[0][0].latitude, addressDataResults[0][0].longitude , user_id]
      ).then((response) => {
        return response.rows[0];
    });
};
