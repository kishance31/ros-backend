

const appUtils = require("../../appUtils");
const employeeConstants = require("./employeeConstants");
const employeeMapper = require("./employeeMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');



function checkUsrValidation(req, res, next) {
    let { id } = req.params
    if (!id) {
        return res.json(employeeMapper.responseMapping(employeeConstants.CODE.FRBDN, employeeConstants.MESSAGES.userIdCantEmpty))
    }
    next();
}


const validateEmployee = function (req, res, next) {
    const errors = [];

    const userDetails = {
        firstName, lastName, position, department, email, username, mobileNo, password, licenseType, branchName, address, corporate_admin_id
    } = req.body;

    // if (_.isEmpty(req.body)) {
    //     errors.push({ message: employeeConstants.MESSAGES.ValidDetails,  code: 500 });
    // }

    if (!firstName || !lastName || !username) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.EmployeeNameCantEmpty })
    }
    if (!email) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.EmailCantEmpty })
    }
    if (!appUtils.isValidEmail(email)) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.emailInvalid });
    }
    if (!password) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.passwordCantEmpty });
    }
    if (!licenseType) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.licenseEmpyt });
    }
    if (!branchName) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.branchNameEmpyt });
    }
    if (!corporate_admin_id) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.userIdCantEmpty });
    }

    if(corporate_admin_id !== req.tokenPayload.userId) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.tokenInvalid });
    }

    if (errors.length > 0) {
        validationError(errors, next);
    }

    req.employeeDetails = userDetails;
    req.employeeDetails.companyName = req.tokenPayload.companyName;

    next();
}

const validateUpdateEmployee = function (req, res, next) {
    const errors = [];

    const userDetails = {
        firstName, lastName, position, department, email, username, mobileNo, licenseType, branchName, address, corporate_admin_id
    } = req.body;

    // if (_.isEmpty(req.body)) {
    //     errors.push({ message: employeeConstants.MESSAGES.ValidDetails,  code: 500 });
    // }

    if (!firstName || !lastName || !username) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.EmployeeNameCantEmpty })
    }
    if (!email) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.EmailCantEmpty })
    }
    if (!appUtils.isValidEmail(email)) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.emailInvalid });
    }
    if (!licenseType) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.licenseEmpyt });
    }
    if (!branchName) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.branchNameEmpyt });
    }
    if (!corporate_admin_id) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.userIdCantEmpty });
    }

    if(corporate_admin_id !== req.tokenPayload.userId) {
        errors.push({ code: employeeConstants.CODE.INTRNLSRVR, message: employeeConstants.MESSAGES.tokenInvalid });
    }

    if (errors.length > 0) {
        validationError(errors, next);
    }

    req.employeeDetails = userDetails;
    req.employeeDetails.companyName = req.tokenPayload.companyName;

    next();
}

const validateTokenId = (req, res, next) => {
    let errors = []
    if (req.params.id !== req.tokenPayload.userId) {
        errors.push({ code: employeeConstants.CODE.Unauthorized, message: employeeConstants.MESSAGES.tokenInvalid });
    }
    if (errors.length > 0) {
        validationError(errors, next);
    }

    next();
}

// Validation Error
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(employeeConstants.MESSAGES.validationError, errors));
    }

    next();
};



module.exports = {
    validateEmployee,
    checkUsrValidation,
    validateTokenId,
    validateUpdateEmployee
}