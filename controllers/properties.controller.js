const {
  insertNewProperty,
  fetchProperties
} = require("../models/properties.model");

exports.postNewProperty = (req, res, next) => {
  const payLoad = req.body;
  insertNewProperty(payLoad).then(result => {
    res.status(201).send({ property: result });
  });
};

exports.getProperties = (req, res, next) => {
  const { min_price, max_price, postcode } = req.query;
  fetchProperties(min_price, max_price, postcode).then(result => {
    res.status(200).send({ properties: result });
  });
};
