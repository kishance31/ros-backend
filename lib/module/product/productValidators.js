

const productConstants = require("./productConstants");
const productMapper = require("./productMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');



function checkUsrValidation(req, res, next) {

  let token = req.headers['tokens']
  let { id } = req.params
  if (!token) {

    res.json(productMapper.responseMapping(productConstants.CODE.FRBDN, productConstants.MESSAGES.TOKEN_NOT_PROVIDED))

  } else {

    jwtHandler.verifyUsrToken(token).then((result) => {

      if (result) {

        next()
      } else {


        res.json(productMapper.responseMapping(productConstants.CODE.FRBDN, productConstants.MESSAGES.TOKEN_NOT_PROVIDED))
      }
    }).catch((err) => {

      console.log({ err })
      res.json(productMapper.responseMapping(productConstants.CODE.FRBDN, productConstants.MESSAGES.TOKEN_NOT_PROVIDED))
    })
  }
}


const validateProduct = function (req, res, next) {
  let productDetails = {
    product_name,
    product_code,
    product_cost,
    ros_code,
    ros_cost,
    license_id,
    category_id,
    sub_category_id,
    product_description
  } = req.body;
  const errors = [];

  if (_.isEmpty(product_name)) {
    errors.push({
      fieldName: "product_name",
      message: productConstants.MESSAGES.ProductNameCantEmpty,
    });
  } else if (_.isEmpty(product_code)) {
    errors.push({
      fieldName: "product_code",
      message: productConstants.MESSAGES.ProductCodeCantEmpty,
    });
  } else if (_.isEmpty(product_cost)) {
    errors.push({
      fieldName: "product_cost",
      message: productConstants.MESSAGES.ProductCostCantEmpty,
    });
  } else if (_.isEmpty(ros_code)) {
    errors.push({
      fieldName: "ros_code",
      message: productConstants.MESSAGES.RosCodeCantEmpty,
    });
  } else if (_.isEmpty(license_id)) {
    errors.push({
      fieldName: "license_id",
      message: productConstants.MESSAGES.LicenseTypeCantEmpty,
    });
  } else {

  }

  if (errors && errors.length > 0) {
    validationError(errors, next);
  }

  req.productDetails = productDetails;
  next();
}

function validateCategoryId(req, res, next) {
  let { categoryId } = req.params;
  if (!categoryId) {
    categoryId = req.body.category_id;
  }
  let errors = [];
  if (!categoryId) {
    errors.push({ code: 500, message: "Category Id is missing." })
  }
  if (errors.length) {
    validationError(errors, next);
  }

  next();
}

const validatePagination = (req, res, next) => {
  let { batch, limit } = req.params;

  batch = batch ? _.toNumber(batch) : 0;
  limit = limit ? _.toNumber(limit) : 5;

  if (_.isNaN(batch)) {
      batch = 0;
  }
  if (_.isNaN(limit)) {
      limit = 5;
  }

  req.pagination = { batch, limit };

  next();
}

const validationError = function (errors, next) {
  if (errors && errors.length > 0) {
    return next(exceptions.getCustomErrorException(productConstants.MESSAGES.validationError, errors));
  }
  next();
};

module.exports = {
  validateProduct,
  validateCategoryId,
  checkUsrValidation,
  validatePagination
}