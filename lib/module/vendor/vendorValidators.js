

const appUtils = require("../../appUtils");
const vendorConstants = require("./vendorConstants");
const vendorMapper = require("./vendorMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");


const validateVendor = function (req, res, next) {
    let fullName = req.body.fullName; 
    let email = req.body.email; 
    let contact = req.body.contact;
    const errors = [];

    if (_.isEmpty(fullName)) {
        errors.push({ fieldName: "fullName", message: vendorConstants.MESSAGES.VendorNameCantEmpty });
    }
    if (!email) {
        errors.push({ fieldName: "email", message: vendorConstants.MESSAGES.EmailCantEmpty })
    }
    if (!appUtils.isValidEmail(email)) {
        errors.push({ fieldName: "email", message: vendorConstants.MESSAGES.emailInvalid });
    }
    if (_.isEmpty(contact)) {
        errors.push({ fieldName: "contact", message: vendorConstants.MESSAGES.ContactCantEmpty });
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(vendorConstants.MESSAGES.validationError, errors));
    }
    next();
};

module.exports = {
    validateVendor
}