
const appUtils = require("../appUtils");
const userConst = require("./userConstants");
const exceptions = require("../customException");
const _ = require('lodash')

// Register validation
function register(req,res,next){
    const { username, password, type, firstName, lastName } = req.body;
    let email = req.body.email;
    const error = [];
    email = req.body.email = _.toLower(email);
    if (!firstName) {
        error.push({ code: 500, message: userConst.MESSAGES.FirstNameCantEmpty });
    } else if (!lastName) {
        error.push({ code: 500, message: userConst.MESSAGES.LastNamCantEmpty });
    } else if (!email) {
		error.push({ code:500, message: userConst.MESSAGES.EmailCantEmpty });
	} else if (!password) {
		error.push({ code:500, message: userConst.MESSAGES.PWD_CANT_EMPTY });
	} else if (password.length < 6) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_NOT_LONG_ENOUGH });
    } 
    // else if(!validation.validateEmail(email)){
	// 	error.push({code:500,message: userConst.MESSAGES.InvalidEmail })
	// }
	if(error.length >0){
		validationError(error,next);
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

// Validation Error
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(userConst.MESSAGES.validationError, errors));
    }

    next();
};

module.exports = {
    validateLogin,
    requiredCheck:register,
    validateResetPassword
};
//========================== Export module end ==================================
