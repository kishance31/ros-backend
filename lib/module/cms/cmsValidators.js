

const appUtils = require("../../appUtils");
const cmsConstants = require("./cmsConstants");
const cmsMapper = require("./cmsMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");




const validateCms = function (req, res, next) {
    let title = req.body.title; 
    let subject = req.body.subject; 
    let description = req.body.description; 
    const errors = [];

    if (_.isEmpty(title)) {
        errors.push({ fieldName: "title", message: cmsConstants.MESSAGES.CmsTitleCantEmpty });
    }
    if (_.isEmpty(subject)) {
        errors.push({ fieldName: "subject", message: cmsConstants.MESSAGES.CmsSubjectCantEmpty });
    }
    if (_.isEmpty(description)) {
        errors.push({ fieldName: "description", message: cmsConstants.MESSAGES.CmsDescriptionCantEmpty });
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
    validateCms
}