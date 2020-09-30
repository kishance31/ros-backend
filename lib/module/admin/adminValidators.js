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
    if (!roleName) {
        errors.push({ code: userConst.CODE.INTRNLSRVR, message: userConst.MESSAGES.RoleCantEmpty });
    }

    if (errors.length > 0) {
        validationError(errors, next);
    }

    req.userDetails = userDetails;

    next();
}

const validateStatus = function (req, res, next) {
    let isActive = req.body.isActive;
    let adminId = req.params.adminId;

    const errors = [];

    if (_.isEmpty(isActive)) {
        errors.push({ code: 500, message: userConst.MESSAGES.statusEmpty });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
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
}