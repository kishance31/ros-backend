
const appUtils = require("./../../appUtils");
const userConst = require("./corporateAdminConstants");
const exceptions = require("./../../commonHandler/customException");
const _ = require('lodash')

// Register validation
function register(req, res, next) {
    const { username, password, type, firstName, lastName } = req.body;
    let email = req.body.email;
    const errors = [];
    email = req.body.email = _.toLower(email);
    if (!appUtils.isValidEmail(email)) {
        errors.push({ code: 500, message: userConst.MESSAGES.InvalidEmail });
    }
    if (!firstName) {
        errors.push({ code: 500, message: userConst.MESSAGES.FirstNameCantEmpty });
    } else if (!lastName) {
        errors.push({ code: 500, message: userConst.MESSAGES.LastNamCantEmpty });
    } else if (!email) {
        error.push({ code: 500, message: userConst.MESSAGES.EmailCantEmpty });
    } else if (!password) {
        errors.push({ code: 500, message: userConst.MESSAGES.PWD_CANT_EMPTY });
    } else if (password.length < 6) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_NOT_LONG_ENOUGH });
    }
    if (errors.length > 0) {
        validationError(errors, next);
    }

    next();
};

// Login validation
const validateLogin = function (req, res, next) {
    let email = req.body.email;
    const { password, role } = req.body;
    const errors = [];

    email = req.body.email = _.toLower(email);
    if (_.isEmpty(password)) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_CANT_EMPTY });
    } else if (password.length < 6) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_NOT_LONG_ENOUGH });
    }
    //  else if (role !== 'Corporate admin' && role !== 'employee') {
    //     errors.push({ fieldName: 'role', message: userConst.MESSAGES.RoleMustBeCorporateOrEmployee });
    // } 
    else if (_.isEmpty(email)) {
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
};

const validateResetPassword = (req, res, next) => {
    const { password, resetToken } = req.body;
    const errors = [];

    if (_.isEmpty(password)) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_CANT_EMPTY });
    } else if (password.length < 6) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_NOT_LONG_ENOUGH });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
};

const validateConfirmPayment = (req, res, next) => {
    const { orders, paypalDetails } = req.body;
    const errors = [];

    if (!orders.length) {
        errors.push({ code: 500, message: "Orders empty." });
    } else if (_.isEmpty(paypalDetails)) {
        errors.push({ code: 500, message: userConst.MESSAGES.validationError });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    req.orders = orders;
    req.paypalDetails = paypalDetails;
    next();
};

// Validation Error
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(userConst.MESSAGES.validationError, errors));
    }

    next();
};

function validateUpdateUser(req, res, next) {
    const { username, firstName, lastName, companyName, position, department, corporateEmailId,
        mobileNo, officeContactNo, _id, email, taxNo, companyRegisterNo } = req.body;
    let errors = [];
    if (!_id) {
        errors.push({ code: 500, message: userConst.MESSAGES.UserIdCantEmpty });
    }
    if (!email) {
        error.push({ code: 500, message: userConst.MESSAGES.EmailCantEmpty });
    } else if (!appUtils.isValidEmail(email)) {
        errors.push({ code: 500, message: userConst.MESSAGES.InvalidEmail });
    }
    if (!firstName) {
        errors.push({ code: 500, message: userConst.MESSAGES.FirstNameCantEmpty });
    } else if (!lastName) {
        errors.push({ code: 500, message: userConst.MESSAGES.LastNamCantEmpty });
    } else if (!username) {
        errors.push({ code: 500, message: userConst.MESSAGES.usernameEmpty });
    } else if (!companyName) {
        errors.push({ code: 500, message: userConst.MESSAGES.companyNameEmpty });
    } else if (!position) {
        errors.push({ code: 500, message: userConst.MESSAGES.positionEmpty });
    } else if (!department) {
        errors.push({ code: 500, message: userConst.MESSAGES.departmentEmpty });
    } else if (!corporateEmailId) {
        errors.push({ code: 500, message: userConst.MESSAGES.coporateEmailIdEmpty });
    } else if (!mobileNo) {
        errors.push({ code: 500, message: userConst.MESSAGES.mobileNoEmpty });
    } else if (!officeContactNo) {
        errors.push({ code: 500, message: userConst.MESSAGES.officeContactNoEmpty });
    }

    if (errors.length > 0) {
        validationError(errors, next);
    }

    req.user = {
        username,
        firstName,
        lastName,
        companyName,
        position,
        department,
        corporateEmailId,
        mobileNo,
        officeContactNo,
        _id,
        email,
        taxNo,
        companyRegisterNo
    }
    next();
};


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

module.exports = {
    validateLogin,
    requiredCheck: register,
    validateResetPassword,
    validateUpdateUser,
    validatePagination,
    validateConfirmPayment
};
//========================== Export module end ==================================
