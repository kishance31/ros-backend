

const appUtils = require("../../appUtils");
const categoryConstants = require("./categoryConstants");
const categoryMapper = require("./categoryMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");



function checkUsrValidation(req, res, next) {

    let token = req.headers['tokens']
    let { id } = req.params
    if (!token) {

        res.json(categoryMapper.responseMapping(categoryConstants.CODE.FRBDN, categoryConstants.MESSAGES.TOKEN_NOT_PROVIDED))

    } else {

        jwtHandler.verifyUsrToken(token).then((result) => {

            if (result) {

                next()
            } else {


                res.json(categoryMapper.responseMapping(categoryConstants.CODE.FRBDN, categoryConstants.MESSAGES.TOKEN_NOT_PROVIDED))
            }
        }).catch((err) => {

            console.log({ err })
            res.json(categoryMapper.responseMapping(categoryConstants.CODE.FRBDN, categoryConstants.MESSAGES.TOKEN_NOT_PROVIDED))
        })
    }
}


const validateCategory = function (req, res, next) {
    let category_name = req.body.category_name; 
    let status = req.body.status; 
    const errors = [];

    if (_.isEmpty(category_name)) {
        errors.push({ fieldName: "category_name", message: categoryConstants.MESSAGES.CategoryNameCantEmpty });
    } else if (_.isEmpty(status)) {
        errors.push({ fieldName: "status", message: categoryConstants.MESSAGES.statusCantEmpty });
    } else {
       
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(categoryConstants.MESSAGES.validationError, errors));
    }
    next();
};

module.exports = {
    validateCategory,
    checkUsrValidation
}