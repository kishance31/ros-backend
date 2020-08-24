"use strict";

const exceptions = require("./../../commonHandler/customException");
const _ = require('lodash');
const purchaseLicenseConstant = require('./purchaseLicenseConstant')

//validate generate orderId
exports.validateCorporateId = (req, res, next) => {
    const { corporateId } = req.params;
    let errors = [];
    if(!corporateId) {
        errors.push({code: 500, message: "Corporate Id is missing."})
    }
    if(errors.length) {
        validationError(errors, next);
    }

    next();
}

exports.validatePurchaseLicense = (req, res, next) => {
    const {
        orderId,
        purchaseLicenses
    } = req.body;
    logger.info(req.body)

    let errors = [];

    if(!orderId) {
        errors.push({code: 500, message: purchaseLicenseConstant.MESSAGES.orderIdMissing})
    }
    if(!_.isArray(purchaseLicenses) || !purchaseLicenses.length) {
        errors.push({code: 500, message: purchaseLicenseConstant.MESSAGES.purchaseLicenseListEmpty})
    } else {
        purchaseLicenses.forEach(license => {
            if(!license.type || !license.quantity) {
                errors.push({code: 500, message: purchaseLicenseConstant.MESSAGES.licenseTypeQuantityEmpty})
            }
            if(!_.isString(license.type)) {
                errors.push({code: 500, message: purchaseLicenseConstant.MESSAGES.licenseTypeString})
            }
            if(!_.isFinite(license.quantity)) {
                errors.push({code: 500, message: purchaseLicenseConstant.MESSAGES.quantityNotNumner})
            }
        });
    }
    

    if(errors.length) {
        validationError(errors, next);
    }

    next();

}

// Validation Error
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(purchaseLicenseConstant.MESSAGES.validationError, errors));
    }

    next();
};