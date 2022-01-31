const {
  insertNewProperty,
  fetchProperties,
  fetchPropertyById
} = require("../models/properties.model");

// POST : api/properties

exports.postNewProperty = (req, res, next) => {
  const payLoad = req.body;

  const postCodeRegEx = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gi;

  if (!postCodeRegEx.test(payLoad.postcode)) {
    return res.status(400).send({ status: 400, msg: "Invalid postcode" });
  }


  insertNewProperty(payLoad)
    .then(result => {
      res.status(201).send({ property: result });
    })
    .catch(next);
};

// GET : api/properties

exports.getProperties = (req, res, next) => {
  const { min_price, max_price, postcode, type } = req.query;
  fetchProperties(min_price, max_price, postcode, type)
    .then(result => {
      res.status(200).send({ properties: result });
    })
    .catch(next);
};

exports.getPropertiesById = (req, res, next) => {
  const { house_id } = req.params;

  fetchPropertyById(house_id)
    .then(result => {
      res.status(200).send(result);
    })
    .catch(next);
};
