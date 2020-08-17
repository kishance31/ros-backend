const _ = require('lodash');
const licenseConst = require('./licensesConstant');
const exceptions = require('../../commonHandler/customException');

exports.validateLicense = (req, res, next) => {
    const { type, price } = req.body;
    const errors = [];
    if(!type) {
        errors.push({code: 500, message: licenseConst.MESSAGES.licenseTypeEmpyt});
    }
    if(!price) {
        errors.push({code: 500, message: licenseConst.MESSAGES.licensePriceEmpty});
    }
    if(price && !_.isFinite(price)) {
        errors.push({code: 500, message: licenseConst.MESSAGES.licensePriceNumber});
    }

    if(errors.length) {
        validationError(errors, next);
    }

    next();
}

// Validation Error
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(licenseConst.MESSAGES.validationError, errors));
    }

    next();
};