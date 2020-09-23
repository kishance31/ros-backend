

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
    let product_name = req.body.product_name;
    let product_code = req.body.product_code;
    let product_cost = req.body.product_cost;
    let ros_code = req.body.ros_code;
    let license_id = req.body.licemse_id;
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
    }  else if (_.isEmpty(license_id)) {
      errors.push({
        fieldName: "ros_code",
        message: productConstants.MESSAGES.LicenseTypeCantEmpty,
      });
    }else {
     
    }
  
    if (errors && errors.length > 0) {
      validationError(errors, next);
    }
  
    next();
}

function validateCategoryId(req, res, next) {
    let { categoryId } = req.params;
    if(!categoryId){
        categoryId = req.body.category_id;
    }
    let errors = [];
    if(!categoryId) {
        errors.push({code: 500, message: "Category Id is missing."})
    }
    if(errors.length) {
        validationError(errors, next);
    }

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
    checkUsrValidation
}