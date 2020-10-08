

const appUtils = require("../../appUtils");
const cmsConstants = require("./cmsConstants");
const cmsMapper = require("./cmsMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");




const validateAboutUs = function (req, res, next) {
    let description = req.body.description; 
    const errors = [];

    if (_.isEmpty(description)) {
        errors.push({ fieldName: "description", message: cmsConstants.MESSAGES.CmsDescriptionCantEmpty });
    }
   

    next();
}

const validateContactUs = function (req, res, next) {
    let email = req.body.email; 
    let contact = req.body.contact; 
    let address = req.body.address; 
    const errors = [];

    if (_.isEmpty(contact)) {
        errors.push({ fieldName: "contact", message: cmsConstants.MESSAGES.CmsContactCantEmpty });
    }
    if (_.isEmpty(address)) {
        errors.push({ fieldName: "address", message: cmsConstants.MESSAGES.CmsAddressCantEmpty });
    }
    if (_.isEmpty(email)) {
        errors.push({ fieldName: "email", message: cmsConstants.MESSAGES.CmsEmailCantEmpty });
    }else {
        if (!appUtils.isValidEmail(email)) {
            errors.push({ fieldName: "email", message: cmsConstants.MESSAGES.InvalidEmail });
        }
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(cmsConstants.MESSAGES.validationError, errors));
    }
    next();
};

module.exports = {
    validateAboutUs,
    validateContactUs
}