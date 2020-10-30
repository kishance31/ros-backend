

const appUtils = require("../../appUtils");
const emailTemplateConstants = require("./emailTemplateConstants");
const emailTemplateMapper = require("./emailTemplateMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");




const validateEmailTemplate = function (req, res, next) {
    let title = req.body.title; 
    let subject = req.body.subject; 
    let description = req.body.description; 
    const errors = [];

    if (_.isEmpty(title)) {
        errors.push({ fieldName: "title", message: emailTemplateConstants.MESSAGES.EmailTemplateTitleCantEmpty });
    }
    if (_.isEmpty(subject)) {
        errors.push({ fieldName: "subject", message: emailTemplateConstants.MESSAGES.EmailTemplateSubjectCantEmpty });
    }
    if (_.isEmpty(description)) {
        errors.push({ fieldName: "description", message: emailTemplateConstants.MESSAGES.EmailTemplateDescriptionCantEmpty });
    }
    if (errors && errors.length > 0) {
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
        return next(exceptions.getCustomErrorException(emailTemplateConstants.MESSAGES.validationError, errors));
    }
    next();
};

module.exports = {
    validateEmailTemplate,
    validatePagination,
}