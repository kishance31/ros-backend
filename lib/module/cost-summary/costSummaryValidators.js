

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
    let { firstTimeMonths, recurringMonthsNo, firstYearCharge, firstYearTerm, secondYearCharge, secondYearTerm } = req.body;
    const errors = [];

    if (!_.isNumber(firstTimeMonths) || firstTimeMonths < 1) {
        errors.push({ code: costSummaryConstants.CODE.Unauthorized , message: costSummaryConstants.MESSAGES.firstTimeMonthsError });
    } else if (!_.isNumber(recurringMonthsNo) || recurringMonthsNo < 1) {
        errors.push({ code: costSummaryConstants.CODE.Unauthorized , message: costSummaryConstants.MESSAGES.recurringMonthsNoError });
    } else if (!_.isNumber(firstYearCharge) || firstYearCharge < 1) {
        errors.push({ code: costSummaryConstants.CODE.Unauthorized , message: costSummaryConstants.MESSAGES.INTRNLSRVR });
    } else if (!_.isNumber(firstYearTerm) || firstYearTerm < 1) {
        errors.push({ code: costSummaryConstants.CODE.Unauthorized , message: costSummaryConstants.MESSAGES.INTRNLSRVR });
    } else if (!_.isNumber(secondYearCharge) || secondYearCharge < 1) {
        errors.push({ code: costSummaryConstants.CODE.Unauthorized , message: costSummaryConstants.MESSAGES.INTRNLSRVR });
    } else if (!_.isNumber(secondYearTerm) || secondYearTerm < 1) {
        errors.push({ code: costSummaryConstants.CODE.Unauthorized , message: costSummaryConstants.MESSAGES.INTRNLSRVR });
    }

    if (errors && errors.length > 0) {
        return validationError(errors, next);
    }

    req.costSummaryDetails = {
        firstTimeMonths,
        recurringMonthsNo,
        firstYearCharge,
        firstYearTerm,
        secondYearCharge,
        secondYearTerm
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