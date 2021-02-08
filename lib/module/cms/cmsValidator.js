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
    } else {
        if (!appUtils.isValidEmail(email)) {
            errors.push({ fieldName: "email", message: cmsConstants.MESSAGES.InvalidEmail });
        }
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}

const validateContactUsQuery = function (req, res, next) {
    let { fullName, email, mobileNo, comment } = req.body
    const errors = [];

    if (_.isEmpty(fullName)) {
        errors.push({ CODE: 500, message: cmsConstants.MESSAGES.INTRNLSRVR });
    }
    if (_.isEmpty(comment)) {
        errors.push({ CODE: 500, message: cmsConstants.MESSAGES.INTRNLSRVR });
    }
    if (_.isEmpty(email)) {
        errors.push({ CODE: 500, message: cmsConstants.MESSAGES.CmsEmailCantEmpty });
    } else {
        if (!appUtils.isValidEmail(email)) {
            errors.push({ fieldName: "email", message: cmsConstants.MESSAGES.InvalidEmail });
        }
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    req.contactUsDetails = {
        fullName, email, mobileNo, comment
    }
    next();
}

const validateFAQ = function (req, res, next) {
    let { question, answer } = req.body
    const errors = [];

    if (_.isEmpty(question)) {
        errors.push({ CODE: 500, message: cmsConstants.MESSAGES.INTRNLSRVR });
    }
    if (_.isEmpty(answer)) {
        errors.push({ CODE: 500, message: cmsConstants.MESSAGES.INTRNLSRVR });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    req.faqDetails = { question, answer }
    next();
}

const validateNewsLetter = function (req, res, next) {
    let { email } = req.body
    const errors = [];

    if (_.isEmpty(email)) {
        errors.push({ CODE: 500, message: cmsConstants.MESSAGES.CmsEmailCantEmpty });
    } else {
        if (!appUtils.isValidEmail(email)) {
            errors.push({ fieldName: "email", message: cmsConstants.MESSAGES.InvalidEmail });
        }
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    req.newsLetterDetails = { email }
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

const validateSocialMediaLinks = function (req, res, next) {

    let facebook = req.body.facebook;
    let instagram = req.body.instagram;
    let pinterest = req.body.pinterest;
    let google = req.body.google;
    let twitter = req.body.twitter;

    const errors = [];

    if (_.isEmpty(facebook)) {
        errors.push({ fieldName: "facebook", message: cmsConstants.MESSAGES.CmsFacebookCantEmpty });
    }
    if (_.isEmpty(instagram)) {
        errors.push({ fieldName: "instagram", message: cmsConstants.MESSAGES.CmsInstagramCantEmpty });
    }
    if (_.isEmpty(pinterest)) {
        errors.push({ fieldName: "pinterest", message: cmsConstants.MESSAGES.CmsPinterestCantEmpty });
    }
    if (_.isEmpty(google)) {
        errors.push({ fieldName: "google", message: cmsConstants.MESSAGES.CmsGoogleCantEmpty });
    }
    if (_.isEmpty(twitter)) {
        errors.push({ fieldName: "twitter", message: cmsConstants.MESSAGES.CmsTwitterCantEmpty });
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    req.socialLinkData = {
        facebook, instagram, pinterest, google, twitter
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
    validateContactUs,
    validateContactUsQuery,
    validatePagination,
    validateFAQ,
    validateNewsLetter,
    validateSocialMediaLinks
}