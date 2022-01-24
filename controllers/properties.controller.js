const { insertNewProperty } = require("../models/properties.model");

exports.postNewProperty = (req, res, next) => {
  const payLoad = req.body;
  insertNewProperty(payLoad).then((result) => {
    res.status(201).send({ property: result });
  });
};
