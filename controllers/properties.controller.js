const {
  insertNewProperty,
  fetchProperties,
} = require("../models/properties.model");


// POST : api/properties

exports.postNewProperty = (req, res, next) => {
  const payLoad = req.body;
  insertNewProperty(payLoad)
    .then((result) => {
      res.status(201).send({ property: result });
    })
    .catch(next);
};

// GET : api/properties

exports.getProperties = (req, res, next) => {
  const { min_price, max_price, postcode, type } = req.query;
  fetchProperties(min_price, max_price, postcode, type)
    .then((result) => {
      res.status(200).send({ properties: result });
    })
    .catch(next);
};
