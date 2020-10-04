

const appUtils = require("../../appUtils");
const costSummaryConstants = require("./costSummaryConstants");
const costSummaryMapper = require("./costSummaryMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");



function checkUsrValidation(req, res, next) {

    let token = req.headers['tokens']
    let { id } = req.params
    if (!token) {

        res.json(costSummaryMapper.responseMapping(costSummaryConstants.CODE.FRBDN, costSummaryConstants.MESSAGES.TOKEN_NOT_PROVIDED))

    } else {

        jwtHandler.verifyUsrToken(token).then((result) => {

            if (result) {

                next()
            } else {


                res.json(costSummaryMapper.responseMapping(costSummaryConstants.CODE.FRBDN, costSummaryConstants.MESSAGES.TOKEN_NOT_PROVIDED))
            }
        }).catch((err) => {

            console.log({ err })
            res.json(costSummaryMapper.responseMapping(costSummaryConstants.CODE.FRBDN, costSummaryConstants.MESSAGES.TOKEN_NOT_PROVIDED))
        })
    }
}


const validateCostSummary = function (req, res, next) {
    let license_name = req.body.license_name; 
    const errors = [];

    if (_.isEmpty(license_name)) {
        errors.push({ fieldName: "license_name", message: costSummaryConstants.MESSAGES.LicenseNameCantEmpty });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(costSummaryConstants.MESSAGES.validationError, errors));
    }
    next();
};

module.exports = {
    validateCostSummary,
    checkUsrValidation
}