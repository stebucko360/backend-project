const { updateSettingsPostcode } = require("../models/settings.model");
const { checkIfUserExists } = require("../utils/testingUtils");
// PATCH: /api/settings/:user_id

exports.patchSettings = (req, res, next) => {
  const { user_id } = req.params;
  const {
    settings_postcode,
    settings_min_price,
    settings_max_price,
    settings_house_type,
    settings_radius,
  } = req.body;

  return Promise.all([
    checkIfUserExists(user_id),
    updateSettingsPostcode(
      settings_postcode,
      user_id,
      settings_min_price,
      settings_max_price,
      settings_house_type,
      settings_radius
    ),
  ])
    .then(([, result]) => {
      res.status(200).send({ settings: result });
    })
    .catch((err) => {
      next(err);
    });
};
