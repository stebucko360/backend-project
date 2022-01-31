const { updateSettingsPostcode } = require("../models/settings.model");
const { checkIfUserExists } = require("../utils/testingUtils");
// PATCH: /api/settings/:user_id

exports.patchSettingsPostcode = (req, res, next) => {
  const { user_id } = req.params;
  const { settings_postcode } = req.body;

  const postCodeRegEx = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gi;

  if (!postCodeRegEx.test(settings_postcode)) {
    return res.status(400).send({ status: 400, msg: "Invalid postcode" });
  }

  const checkUserName = Promise.all([checkIfUserExists(user_id)]);

  checkUserName
    .then(() => {
      return updateSettingsPostcode(settings_postcode, user_id);
    })
    .then((result) => {
      res.status(200).send({ settings: result });
    })
    .catch((err) => {
      next(err)
    });
};
