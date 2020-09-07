

const appUtils = require("../../appUtils");
const branchConstants = require("./branchConstants");
const branchMapper = require("./branchMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");



function checkUsrValidation(req, res, next) {

    let token = req.headers['tokens']
    let { id } = req.params
    if (!token) {

        res.json(branchMapper.responseMapping(branchConstants.CODE.FRBDN, branchConstants.MESSAGES.TOKEN_NOT_PROVIDED))

    } else {

        jwtHandler.verifyUsrToken(token).then((result) => {

            if (result) {

                next()
            } else {


                res.json(branchMapper.responseMapping(branchConstants.CODE.FRBDN, branchConstants.MESSAGES.TOKEN_NOT_PROVIDED))
            }
        }).catch((err) => {

            console.log({ err })
            res.json(branchMapper.responseMapping(branchConstants.CODE.FRBDN, branchConstants.MESSAGES.TOKEN_NOT_PROVIDED))
        })
    }
}


const validateBranch = function (req, res, next) {

    let email = req.body.email_id;
    let branch_name = req.body.branch_name; 
    let company_name = req.body.company_name; 

    const errors = [];

    email = req.body.email = _.toLower(email);
    if (_.isEmpty(branch_name)) {
        errors.push({ fieldName: "branch_name", message: branchConstants.MESSAGES.BranchNameCantEmpty });
    } else if (_.isEmpty(company_name)) {
        errors.push({ fieldName: "company_name", message: branchConstants.MESSAGES.companyNameCantEmpty });
    } 
    else if (_.isEmpty(email)) {
        errors.push({ fieldName: "email_id", message: branchConstants.MESSAGES.EmailCantEmpty });
    } else {
        if (!appUtils.isValidEmail(email)) {
            errors.push({ fieldName: "email_id", message: branchConstants.MESSAGES.InvalidEmail });
        }
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}

exports.validateCorporateId = (req, res, next) => {
    let { corporateId } = req.params;
    if(!corporateId){
        corporateId = req.body.corporate_admin_id;
    }
    let errors = [];
    if(!corporateId) {
        errors.push({code: 500, message: "Corporate Id is missing."})
    }
    if(errors.length) {
        validationError(errors, next);
    }

    next();
}
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(branchConstants.MESSAGES.validationError, errors));
    }
    next();
};
module.exports = {
    validateBranch,
    checkUsrValidation
}