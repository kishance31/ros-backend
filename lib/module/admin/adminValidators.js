/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const appUtils = require("./../../appUtils");
const userConst = require("./adminConstants");
const adminMapper = require("./adminMapper");
const exceptions = require("./../../commonHandler/customException");
const jwtHandler = require('./../../commonHandler/jwtHandler');
const _ = require('lodash');
const constants = require("../../constants");
const adminConstants = require("./adminConstants");

/**
 * admin is authorized or not
 *
 * @async
 * @desc admin user authorization
 * 
 * @param {Object} req, request object to validate incoming request
 * @param {Object} res, response object to send response
 * @param {Object} next, passing it on to next middleware
 * 
 * @returns {*|Promise<any | never>|failureHandler}
 * 
 */
function checkAdminValidation(req, res, next) {
    let { corporateUserId } = req.params;
    const errors = [];
    if (!corporateUserId) {
        errors.push({ code: constants, message: userConst.MESSAGES.UserIdCantEmpty });
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}

/**
 * validate admin login input
 *
 * @async
 * @desc admin user authorization
 * 
 * @param {Object} req, request object to validate incoming request
 * @param {Object} res, response object to send response
 * @param {Object} next, passing it on to next middleware
 * 
 * @returns {*|Promise<any | never>|failureHandler}
 * 
 */
const validateLogin = function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;

    const errors = [];

    email = req.body.email = _.toLower(email);

    if (_.isEmpty(password)) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_CANT_EMPTY });
    } else if (password.length < 6) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_NOT_LONG_ENOUGH });
    } else if (_.isEmpty(email)) {
        errors.push({ fieldName: "email", message: userConst.MESSAGES.EmailCantEmpty });
    } else {
        if (!appUtils.isValidEmail(email)) {
            errors.push({ fieldName: "email", message: userConst.MESSAGES.InvalidEmail });
        }
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}

/**
 * validation error handler
 *
 * @async
 * @desc handler validation
 * 
 * @param {Object} errors, list of errors
 * @param {Object} next, passing it on to next middleware
 * 
 */
const validateAdmin = function (req, res, next) {
    const errors = [];

    const userDetails = {
        firstName, lastName, email, roleName,
        password, mobileNo
    } = req.body;

    // if (_.isEmpty(req.body)) {
    //     errors.push({ message: userConst.MESSAGES.ValidDetails,  code: 500 });
    // }

    if (!firstName || !lastName) {
        errors.push({ code: userConst.CODE.INTRNLSRVR, message: userConst.MESSAGES.UserNameCantEmpty })
    }
    if (!email) {
        errors.push({ code: userConst.CODE.INTRNLSRVR, message: userConst.MESSAGES.EmailCantEmpty })
    }
    if (!appUtils.isValidEmail(email)) {
        errors.push({ code: userConst.CODE.INTRNLSRVR, message: userConst.MESSAGES.InvalidEmail });
    }
    if (!password) {
        errors.push({ code: userConst.CODE.INTRNLSRVR, message: userConst.MESSAGES.PWD_CANT_EMPTY });
    }
    if (!roleName) {
        errors.push({ code: userConst.CODE.INTRNLSRVR, message: userConst.MESSAGES.RoleCantEmpty });
    }


    if (errors.length > 0) {
        validationError(errors, next);
    }

    req.userDetails = userDetails;

    next();
}

const validateEditAdmin = function (req, res, next) {
    const errors = [];

    const userDetails = {
        firstName, lastName, email, roleName,
        mobileNo
    } = req.body;

    if (!firstName || !lastName) {
        errors.push({ code: userConst.CODE.INTRNLSRVR, message: userConst.MESSAGES.UserNameCantEmpty })
    }
    if (!email) {
        errors.push({ code: userConst.CODE.INTRNLSRVR, message: userConst.MESSAGES.EmailCantEmpty })
    }
    if (!appUtils.isValidEmail(email)) {
        errors.push({ code: userConst.CODE.INTRNLSRVR, message: userConst.MESSAGES.InvalidEmail });
    }
    // if (!roleName) {
    //     errors.push({ code: userConst.CODE.INTRNLSRVR, message: userConst.MESSAGES.RoleCantEmpty });
    // }

    if (errors.length > 0) {
        validationError(errors, next);
    }

    req.userDetails = {
        firstName,
        lastName,
        email,
        mobileNo
    };

    if(roleName) {
        req.userDetails.roleName = roleName;
    }
    next();
}

const validateStatus = function (req, res, next) {
    let isActive = req.body.isActive;
    let adminId = req.params.adminId;

    const errors = [];

    if (!_.isBoolean(isActive)) {
        errors.push({ code: 500, message: userConst.MESSAGES.invalidIsActive })
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}

const validateEmail = function (req, res, next) {
    let { email } = req.body;

    const errors = [];

    if (_.isEmpty(email)) {
        errors.push(
            adminMapper.responseMapping(adminConstants.CODE.Unauthorized, userConst.MESSAGES.EmailCantEmpty)
        );
    } else {
        if (!appUtils.isValidEmail(email)) {
            errors.push(
                adminMapper.responseMapping(adminConstants.CODE.Unauthorized, userConst.MESSAGES.InvalidEmail)
            );
        }
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    req.email = _.toLower(email);
    next();
}

const validateResetPassword = function (req, res, next) {
    let { resetToken, newPassword } = req.body;

    const errors = [];

    if (_.isEmpty(resetToken)) {
        errors.push(
            adminMapper.responseMapping(adminConstants.CODE.Unauthorized, userConst.MESSAGES.resetTokenEmpty)
        );
    }

    if (_.isEmpty(newPassword)) {
        errors.push(
            adminMapper.responseMapping(adminConstants.CODE.Unauthorized, userConst.MESSAGES.PWD_CANT_EMPTY)
        );
    }


    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}

const validateChangePassword = function (req, res, next) {
    let { password, newPassword, email } = req.body;

    const errors = [];

    if (_.isEmpty(email)) {
        errors.push(
            adminMapper.responseMapping(adminConstants.CODE.Unauthorized, userConst.MESSAGES.EmailCantEmpty)
        );
    }

    if (_.isEmpty(password)) {
        errors.push(
            adminMapper.responseMapping(adminConstants.CODE.Unauthorized, userConst.MESSAGES.PWD_CANT_EMPTY)
        );
    }

    if (_.isEmpty(newPassword)) {
        errors.push(
            adminMapper.responseMapping(adminConstants.CODE.Unauthorized, userConst.MESSAGES.PWD_CANT_EMPTY)
        );
    }


    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}

const validatePagination = (req, res, next) => {
    let { batch, limit } = req.params;

    batch = batch ? _.toNumber(batch) : 0;
    limit = limit ? _.toNumber(limit) : 10;

    if (_.isNaN(batch)) {
        batch = 0;
    }
    if (_.isNaN(limit)) {
        limit = 10;
    }

    req.pagination = { batch, limit };

    next();
}

const validateOrderDispatch = (req, res, next) => {
    let errors = [];
    try {
        let { id } = req.params;
        let { deliveryStatus, dispatchDate, deliveryDate, status } = req.body;
        dispatchDate = new Date(dispatchDate);
        if (deliveryDate) {
            deliveryDate = new Date(deliveryDate);
        }

        if (!id) {
            errors.push(
                adminMapper.responseMapping(adminConstants.CODE.Unauthorized, userConst.MESSAGES.UserIdCantEmpty)
            );
        }

        if (!status) {
            if (!deliveryStatus) {
                errors.push(
                    adminMapper.responseMapping(adminConstants.CODE.Unauthorized, userConst.MESSAGES.internalServerError)
                );
            }

            if (dispatchDate && !_.isDate((dispatchDate))) {
                errors.push(
                    adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, userConst.MESSAGES.internalServerError)
                );
            }

            if (deliveryDate && !_.isDate(deliveryDate)) {
                errors.push(
                    adminMapper.responseMapping(adminConstants.CODE.FRBDN, userConst.MESSAGES.internalServerError)
                );
            }
        }

        if (errors && errors.length > 0) {
            return validationError(errors, next);
        }

        req.orderDetails = status ? { status, orderConfirmDate: new Date() } : { deliveryStatus, dispatchDate };
        if (!status && deliveryDate) {
            req.orderDetails.deliveryDate = deliveryDate;
        }

        next();
    } catch (err) {
        errors.push(
            adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, userConst.MESSAGES.internalServerError)
        );
        validationError(errors, next);
    }
}

const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(userConst.MESSAGES.validationError, errors));
    }
    next();
};

module.exports = {
    validateLogin,
    validateAdmin,
    checkAdminValidation,
    validateStatus,
    validateEditAdmin,
    validateEmail,
    validateResetPassword,
    validatePagination,
    validateOrderDispatch,
    validateChangePassword
}