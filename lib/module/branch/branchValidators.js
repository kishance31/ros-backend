

const appUtils = require("../../appUtils");
const branchConstants = require("./branchConstants");
const branchMapper = require("./branchMapper");
const exceptions = require("../../commonHandler/customException");
const _ = require('lodash');

const validateBranch = function (req, res, next) {
    const errors = [];

    const branchDetails = { company_name, email_id, location, mobile_no, corporate_admin_id } = req.body;

    const { userId } = req.tokenPayload;

    if (corporate_admin_id !== userId) {
        errors.push({ code: branchConstants.CODE.Unauthorized, message: branchConstants.MESSAGES.tokenInvalid });
    }

    if (_.isEmpty(req.body)) {
        errors.push({ code: branchConstants.CODE.Unauthorized, message: branchConstants.MESSAGES.ValidDetails });
    }
    if (!company_name) {
        errors.push({ code: branchConstants.CODE.Unauthorized, message: branchConstants.MESSAGES.companyNameCantEmpty })
    }
    if (!email_id) {
        errors.push({ code: branchConstants.CODE.Unauthorized, message: branchConstants.MESSAGES.EmailCantEmpty })
    }
    if (!appUtils.isValidEmail(email_id)) {
        errors.push({ code: branchConstants.CODE.Unauthorized, message: branchConstants.MESSAGES.emailInvalid });
    }
    if (!location) {
        errors.push({ code: branchConstants.CODE.Unauthorized, message: branchConstants.MESSAGES.LocationCantEmpty })
    }
    if (!mobile_no) {
        errors.push({ code: branchConstants.CODE.Unauthorized, message: branchConstants.MESSAGES.mobileCantEmpty })
    }
    if (!corporate_admin_id) {
        errors.push({ code: branchConstants.CODE.Unauthorized, message: branchConstants.MESSAGES.userIdCantEmpty })
    }

    if (errors.length > 0) {
        validationError(errors, next);
    }

    req.branchDetails = branchDetails;
    next();
}

const validateTokenId = (req, res, next) => {
    let errors = []
    if (req.params.id !== req.tokenPayload.userId) {
        errors.push({ code: branchConstants.CODE.Unauthorized, message: branchConstants.MESSAGES.tokenInvalid });
    }
    if (errors.length > 0) {
        validationError(errors, next);
    }

    next();
}

const checkBranchId = (req, res, next) => {
    let errors = []
    if (!req.params.id) {
        errors.push({ code: branchConstants.CODE.Unauthorized, message: branchConstants.MESSAGES.branchIdMissing });
    }
    if (errors.length > 0) {
        validationError(errors, next);
    }

    next();
}

// Validation Error
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(branchConstants.MESSAGES.validationError, errors));
    }

    next();
};

function checkUsrValidation(req, res, next) {

    let token = req.headers['tokens']
    if (!token) {

        return res.json(branchMapper.responseMapping(branchConstants.CODE.FRBDN, branchConstants.MESSAGES.TOKEN_NOT_PROVIDED))

    }
    next();
}

module.exports = {
    validateBranch,
    checkUsrValidation,
    validateTokenId,
    checkBranchId
}