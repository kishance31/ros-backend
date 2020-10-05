

const appUtils = require("../../appUtils");
const subcategoryConstants = require("./subcategoryConstants");
const subcategoryMapper = require("./subcategoryMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");



function checkUsrValidation(req, res, next) {

    let token = req.headers['tokens']
    let { id } = req.params
    if (!token) {

        res.json(subcategoryMapper.responseMapping(subcategoryConstants.CODE.FRBDN, subcategoryConstants.MESSAGES.TOKEN_NOT_PROVIDED))

    } else {

        jwtHandler.verifyUsrToken(token).then((result) => {

            if (result) {

                next()
            } else {


                res.json(subcategoryMapper.responseMapping(subcategoryConstants.CODE.FRBDN, subcategoryConstants.MESSAGES.TOKEN_NOT_PROVIDED))
            }
        }).catch((err) => {

            console.log({ err })
            res.json(subcategoryMapper.responseMapping(subcategoryConstants.CODE.FRBDN, subcategoryConstants.MESSAGES.TOKEN_NOT_PROVIDED))
        })
    }
}


const validateSubCategory = function (req, res, next) {

    let subcategory_name = req.body.subcategory_name; 
    let category_id = req.body.category_id; 
    const errors = [];

    if (_.isEmpty(subcategory_name)) {
        errors.push({ fieldName: "category_name", message: subcategoryConstants.MESSAGES.SubCategoryNameCantEmpty });
    } else  if (_.isEmpty(category_id)){
        errors.push({ fieldName: "status", message: subcategoryConstants.MESSAGES.CategoryCantEmpty });
       
    }else{

    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    req.categoryDetails = {subcategory_name, category_id}
    next();
}

const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(subcategoryConstants.MESSAGES.validationError, errors));
    }
    next();
  };
module.exports = {
    validateSubCategory,
    checkUsrValidation
}